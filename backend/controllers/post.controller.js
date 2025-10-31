import 'dotenv/config';

import ImageKit from "imagekit";
import Post from "../models/post.model.js";
import User from "../models/user.model.js";

export const getPosts = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 2;

  const query = {};

  console.log(req.query);

  const cat = req.query.cat;
  const author = req.query.author;
  const searchQuery = req.query.search;
  const sortQuery = req.query.sort;
  const featured = req.query.featured;

  if (cat) {
    query.category = cat;
  }

  if (searchQuery) {
    query.title = { $regex: searchQuery, $options: "i" };
  }

  if (author) {
    const user = await User.findOne({ username: author }).select("_id");

    if (!user) {
      return res.status(404).json("Nenhuma matéria encontrada!");
    }

    query.user = user._id;
  }

  let sortObj = { createdAt: -1 };

  if (sortQuery) {
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
        query.createdAt = {
          $gte: new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000),
        };
        break;
      default:
        break;
    }
  }

  if (featured) {
    query.isFeatured = true;
  }

  const posts = await Post.find(query)
    .populate("user", "username")
    .sort(sortObj)
    .limit(limit)
    .skip((page - 1) * limit);

  const totalPosts = await Post.countDocuments();
  const hasMore = page * limit < totalPosts;

  res.status(200).json({ posts, hasMore });
};

export const getPost = async (req, res) => {
  const post = await Post.findOne({ slug: req.params.slug }).populate(
    "user",
    "username img"
  );
  res.status(200).json(post);
};

export const createPost = async (req, res) => {
  // Clerk mudou: req.auth() é a forma nova; mantenho fallback por compatibilidade
  const auth = typeof req.auth === "function" ? req.auth() : req.auth || {};
  const clerkUserId = auth.userId;

  if (!clerkUserId) return res.status(401).json("Não autenticado!");

  // tenta achar; se não existir, cria
  let user = await User.findOne({ clerkUserId });
  if (!user) {
    const claims = auth.sessionClaims || {};
    const email =
      claims?.email ||
      claims?.email_address ||
      claims?.primary_email_address?.email_address ||
      `${clerkUserId}@dev.local`;

    const username =
      claims?.username ||
      (typeof email === "string" ? email.split("@")[0] : null) ||
      `user_${clerkUserId.slice(-6)}`;

    user = await User.create({
      clerkUserId,
      username,
      email,
      img: claims?.image_url || "",
    });
  }

  // ...segue igual
  let slug = req.body.title.replace(/ /g, "-").toLowerCase();
  let existingPost = await Post.findOne({ slug });
  let counter = 2;
  while (existingPost) {
    slug = `${slug}-${counter}`;
    existingPost = await Post.findOne({ slug });
    counter++;
  }

  const newPost = new Post({ user: user._id, slug, ...req.body });
  const post = await newPost.save();
  return res.status(200).json(post);
};

export const deletePost = async (req, res) => {
  const clerkUserId = req.auth.userId;

  if (!clerkUserId) {
    return res.status(401).json("Não autenticado!");
  }

  const role = req.auth.sessionClaims?.metadata?.role || "user";

  if (role === "admin") {
    await Post.findByIdAndDelete(req.params.id);
    return res.status(200).json("Matéria excluída");
  }

  const user = await User.findOne({ clerkUserId });

  const deletedPost = await Post.findOneAndDelete({
    _id: req.params.id,
    user: user._id,
  });

  if (!deletedPost) {
    return res.status(403).json("Você só pode excluir suas próprias matérias!");
  }

  res.status(200).json("Matéria excluída");
};

export const featurePost = async (req, res) => {
  const clerkUserId = req.auth.userId;
  const postId = req.body.postId;

  if (!clerkUserId) {
    return res.status(401).json("Não autenticado!");
  }

  const role = req.auth.sessionClaims?.metadata?.role || "user";

  if (role !== "admin") {
    return res.status(403).json("Você não pode destacar matérias!");
  }

  const post = await Post.findById(postId);

  if (!post) {
    return res.status(404).json("Matéria não encontrada!");
  }

  const isFeatured = post.isFeatured;

  const updatedPost = await Post.findByIdAndUpdate(
    postId,
    {
      isFeatured: !isFeatured,
    },
    { new: true }
  );

  res.status(200).json(updatedPost);
};

const imagekit = new ImageKit({
  urlEndpoint: process.env.IK_URL_ENDPOINT,
  publicKey: process.env.IK_PUBLIC_KEY,
  privateKey: process.env.IK_PRIVATE_KEY,
});

export const uploadAuth = (req, res) => {
  try {
    // Diagnóstico rápido sem vazar segredos (true/false)
    console.log('HIT /posts/upload-auth', {
      hasUrl: !!process.env.IK_URL_ENDPOINT,
      hasPub: !!process.env.IK_PUBLIC_KEY,
      hasPri: !!process.env.IK_PRIVATE_KEY,
    });

    const result = imagekit.getAuthenticationParameters();
    return res.json(result);
  } catch (e) {
    console.error('ImageKit auth error:', e);
    return res.status(500).json({ message: 'Falha na autenticação do ImageKit' });
  }
};
