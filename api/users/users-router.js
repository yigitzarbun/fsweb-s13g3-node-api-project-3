const express = require("express");

// `users-model.js` ve `posts-model.js` sayfalarına ihtiyacınız var
// ara yazılım fonksiyonları da gereklidir

const router = express.Router();
const users = require("./users-model");
const posts = require("./../posts/posts-model");

const md = require("./../middleware/middleware");

router.get("/", (req, res, next) => {
  // TÜM KULLANICILARI İÇEREN DİZİYİ DÖNDÜRÜN
  users
    .get()
    .then((usersList) => res.status(200).json(usersList))
    .catch((err) => next(err));
});

router.get("/:id", md.validateUserId, md.logger, (req, res) => {
  // USER NESNESİNİ DÖNDÜRÜN
  // user id yi getirmek için bir ara yazılım gereklidir
  res.json(req.user);
});

router.post("/", md.validateUser, md.logger, (req, res, next) => {
  // YENİ OLUŞTURULAN USER NESNESİNİ DÖNDÜRÜN
  // istek gövdesini doğrulamak için ara yazılım gereklidir.
  users
    .insert({ name: req.name })
    .then((insertedUser) => {
      res.json(insertedUser);
    })
    .catch(next);
});

router.put("/:id", md.validateUserId, md.validateUser, async (req, res) => {
  try {
    await users.update(req.params.id, { name: req.name });
    let updated = await users.getById(req.params.id);
    res.status(201).json(updated);
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", md.validateUserId, async (req, res, next) => {
  try {
    await users.remove(req.params.id);
    res.json(req.user);
  } catch (error) {
    next(error);
  }
});

router.get("/:id/posts", md.validateUserId, async (req, res, next) => {
  try {
    let userPosts = await users.getUserPosts(req.params.id);
    res.json(userPosts);
  } catch (error) {
    next(error);
  }
});

router.post(
  "/:id/posts",
  md.validateUserId,
  md.validatePost,
  async (req, res, next) => {
    try {
      let insertedPost = await posts.insert({
        user_id: req.params.id,
        text: req.text,
      });
      res.json(insertedPost);
    } catch (error) {
      next(error);
    }
  }
);

// routerı dışa aktarmayı unutmayın
router.use((err, res, req) => {
  res
    .status(err.status || 500)
    .json({ customMessage: "Bir hata oluştu", message: err.message });
});
module.exports = router;
