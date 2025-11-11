import "dotenv/config";

import ImageKit from "imagekit";
import Post from "../models/post.model.js";
import User from "../models/user.model.js";

/* =========================================================================
 * Utils
 * ========================================================================= */
const slugify = (str = "") =>
  String(str)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");

const makeUniqueSlug = async (base, excludeId = null) => {
  let slug = base || "";
  let i = 2;
  const exists = async (s) =>
    excludeId
      ? await Post.exists({ slug: s, _id: { $ne: excludeId } })
      : await Post.exists({ slug: s });

  while (await exists(slug)) slug = `${base}-${i++}`;
  return slug;
};

const getAuthInfo = (req) => {
  const auth = typeof req.auth === "function" ? req.auth() : req.auth || {};
  const userId = auth.userId;
  const role =
    auth?.sessionClaims?.metadata?.role ||
    auth?.sessionClaims?.role ||
    "user";
  const claims = auth?.sessionClaims || {};
  return { userId, role, claims };
};

/* =========================================================================
 * LISTAR — paginação correta (sem “buracos”) e filtros
 * ========================================================================= */
export const getPosts = async (req, res) => {
  const page = Math.max(parseInt(req.query.page) || 1, 1);
  const limit = Math.min(Math.max(parseInt(req.query.limit) || 10, 1), 50);

  const query = {};
  const cat = req.query.cat;
  const author = req.query.author;
  const searchQuery = req.query.search;
  const sortQuery = req.query.sort;
  const featured = req.query.featured;

  if (cat) query.category = cat;
  if (featured) query.isFeatured = true;
  if (searchQuery) query.title = { $regex: searchQuery, $options: "i" };

  if (author) {
    const user = await User.findOne({ username: author }).select("_id");
    if (!user)
      return res.status(200).json({ posts: [], hasMore: false, page, total: 0, limit });
    query.user = user._id;
  }

  let sortObj = { createdAt: -1 };
  switch (sortQuery) {
    case "newest":
      sortObj = { createdAt: -1 };
      break;
    case "oldest":
      sortObj = { createdAt: 1 };
      break;
    case "popular":
      sortObj = { visit: -1 };
      break;
    case "trending":
      sortObj = { visit: -1 };
      query.createdAt = { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) };
      break;
    default:
      break;
  }

  const [posts, total] = await Promise.all([
    Post.find(query)
      .populate("user", "username")
      .sort(sortObj)
      .skip((page - 1) * limit)
      .limit(limit),
    Post.countDocuments(query),
  ]);

  const hasMore = page * limit < total;

  return res.status(200).json({ posts, hasMore, page, total, limit });
};

/* =========================================================================
 * OBTER
 * ========================================================================= */
export const getPost = async (req, res) => {
  const post = await Post.findOne({ slug: req.params.slug }).populate(
    "user",
    "username img"
  );
  if (!post) return res.status(404).json("Matéria não encontrada!");
  return res.status(200).json(post);
};

/* =========================================================================
 * CRIAR
 * ========================================================================= */
export const createPost = async (req, res) => {
  const { userId, claims } = getAuthInfo(req);
  if (!userId) return res.status(401).json("Não autenticado!");

  // encontra/cria usuário local
  let user = await User.findOne({ clerkUserId: userId });
  if (!user) {
    const email =
      claims?.email ||
      claims?.email_address ||
      claims?.primary_email_address?.email_address ||
      `${userId}@dev.local`;

    const username =
      claims?.username ||
      (typeof email === "string" ? email.split("@")[0] : null) ||
      `user_${String(userId).slice(-6)}`;

    user = await User.create({
      clerkUserId: userId,
      username,
      email,
      img: claims?.image_url || "",
    });
  }

  const base = slugify(req.body?.title || "");
  const slug = await makeUniqueSlug(base);

  const newPost = new Post({ user: user._id, slug, ...req.body });
  const post = await newPost.save();
  return res.status(200).json(post);
};

/* =========================================================================
 * ATUALIZAR (edição inline na SinglePostPage)
 * ========================================================================= */
export const updatePost = async (req, res) => {
  const { userId, role } = getAuthInfo(req);
  if (!userId) return res.status(401).json("Não autenticado!");

  const { id } = req.params;
  const post = await Post.findById(id);
  if (!post) return res.status(404).json("Matéria não encontrada!");

  // autorização: admin OU autor
  if (role !== "admin") {
    const dbUser = await User.findOne({ clerkUserId: userId }).select("_id");
    if (!dbUser) return res.status(403).json("Sem permissão!");
    const isOwner = String(post.user) === String(dbUser._id);
    if (!isOwner) return res.status(403).json("Sem permissão!");
  }

  const allowed = ["title", "desc", "category", "img", "content"];
  const updates = {};
  for (const k of allowed) if (k in req.body) updates[k] = req.body[k];

  if (
    typeof updates.title === "string" &&
    updates.title.trim() &&
    updates.title !== post.title
  ) {
    const base = slugify(updates.title);
    updates.slug = await makeUniqueSlug(base, post._id);
  }

  const updated = await Post.findByIdAndUpdate(id, updates, { new: true });
  return res.status(200).json(updated);
};

/* =========================================================================
 * EXCLUIR
 * ========================================================================= */
export const deletePost = async (req, res) => {
  const auth = typeof req.auth === "function" ? req.auth() : req.auth || {};
  const clerkUserId = auth.userId;
  if (!clerkUserId) return res.status(401).json("Não autenticado!");

  const role = auth.sessionClaims?.metadata?.role || "user";

  if (role === "admin") {
    await Post.findByIdAndDelete(req.params.id);
    return res.status(200).json("Matéria excluída");
  }

  const user = await User.findOne({ clerkUserId });
  const deletedPost = await Post.findOneAndDelete({
    _id: req.params.id,
    user: user._id,
  });

  if (!deletedPost)
    return res
      .status(403)
      .json("Você só pode excluir suas próprias matérias!");

  return res.status(200).json("Matéria excluída");
};

/* =========================================================================
 * DESTACAR
 * ========================================================================= */
export const featurePost = async (req, res) => {
  const auth = typeof req.auth === "function" ? req.auth() : req.auth || {};
  const clerkUserId = auth.userId;
  const postId = req.body.postId;

  if (!clerkUserId) return res.status(401).json("Não autenticado!");

  const role = auth.sessionClaims?.metadata?.role || "user";
  if (role !== "admin")
    return res.status(403).json("Você não pode destacar matérias!");

  const post = await Post.findById(postId);
  if (!post) return res.status(404).json("Matéria não encontrada!");

  const updatedPost = await Post.findByIdAndUpdate(
    postId,
    { isFeatured: !post.isFeatured },
    { new: true }
  );

  return res.status(200).json(updatedPost);
};

/* =========================================================================
 * ImageKit auth
 * ========================================================================= */
const imagekit = new ImageKit({
  urlEndpoint: process.env.IK_URL_ENDPOINT,
  publicKey: process.env.IK_PUBLIC_KEY,
  privateKey: process.env.IK_PRIVATE_KEY,
});

export const uploadAuth = (req, res) => {
  try {
    const result = imagekit.getAuthenticationParameters();
    return res.json(result);
  } catch (e) {
    console.error("ImageKit auth error:", e);
    return res
      .status(500)
      .json({ message: "Falha na autenticação do ImageKit" });
  }
};
