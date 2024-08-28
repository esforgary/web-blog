import PostModel from '../models/Post.js';

export const getLastTags = async (req, res) => {
  try {
    const posts = await PostModel.find().limit(5).exec();

    const tags = posts
      .map((obj) => obj.tags)
      .flat()
      .slice(0, 5);

    res.json(tags);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: 'Не вдалось отримати теги',
    });
  }
};

export const getAll = async (req, res) => {
  try {
    const posts = await PostModel.find().populate('user').exec();
    res.json(posts);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: 'Не вдалось отримати статті',
    });
  }
};

export const getOne = async (req, res) => {
  try {
    const postId = req.params.id;

    const doc = await PostModel.findOneAndUpdate(
      { _id: postId },
      { $inc: { viewsCount: 1 } },
      { returnDocument: 'after' }
    ).populate('user');
    
    if (!doc) {
      return res.status(404).json({
        message: 'Стаття не знайдена',
      });
    }

    res.json(doc);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: 'Не вдалось отримати статтю',
    });
  }
};

export const remove = async (req, res) => {
  try {
    const postId = req.params.id;

    const doc = await PostModel.findOneAndDelete({ _id: postId });

    if (!doc) {
      return res.status(404).json({
        message: 'Стаття не знайдена',
      });
    }

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: 'Не вдалось видалити статтю',
    });
  }
};

export const create = async (req, res) => {
  try {
    const { title, text, imageUrl, tags } = req.body;
    const doc = new PostModel({
      title,
      text,
      imageUrl,
      tags: tags.split(','),
      user: req.userId,
    });

    const post = await doc.save();
    res.json(post);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: 'Не вдалось створити статтю',
    });
  }
};

export const update = async (req, res) => {
  try {
    const postId = req.params.id;
    const { title, text, imageUrl, tags } = req.body;

    await PostModel.updateOne(
      { _id: postId },
      {
        title,
        text,
        imageUrl,
        user: req.userId,
        tags: tags.split(','),
      }
    );

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: 'Не вдалось оновити статтю',
    });
  }
};
