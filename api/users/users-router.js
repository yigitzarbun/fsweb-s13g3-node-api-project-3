const express = require("express");

// `users-model.js` ve `posts-model.js` sayfalarına ihtiyacınız var
// ara yazılım fonksiyonları da gereklidir

const router = express.Router();
const users = require("./users-model");
const posts = require("./../posts/posts-model");

const md = require("./../middleware/middleware");

router.get("/", (req, res) => {
  // TÜM KULLANICILARI İÇEREN DİZİYİ DÖNDÜRÜN
  users
    .get()
    .then((usersList) => res.status(200).json(usersList))
    .catch((err) =>
      res.status(500).json({ message: "Kullanıcılar alınamadı" })
    );
});

router.get("/:id", md.validateUserId, md.logger, (req, res) => {
  // USER NESNESİNİ DÖNDÜRÜN
  // user id yi getirmek için bir ara yazılım gereklidir
  const { id } = req.params;
  users
    .getById(id)
    .then((user) => res.status(200).json(user))
    .catch((err) => res.status(404).json({ message: "kullanıcı bulunamadı" }));
});

router.post("/", md.validateUser, md.logger, (req, res) => {
  // YENİ OLUŞTURULAN USER NESNESİNİ DÖNDÜRÜN
  // istek gövdesini doğrulamak için ara yazılım gereklidir.
  const newUser = { name: req.body.name };
  users
    .insert(newUser)
    .then((user) => res.status(200).json(user))
    .catch((err) =>
      res.status(404).json({ message: "user oluştururken hata oluştu" })
    );
});

router.put(
  "/:id",
  md.validateUserId,
  md.validateUser,
  md.logger,
  (req, res) => {
    // YENİ GÜNCELLENEN USER NESNESİNİ DÖNDÜRÜN
    // user id yi doğrulayan ara yazılım gereklidir
    // ve istek gövdesini doğrulayan bir ara yazılım gereklidir.
    const { id } = req.params;
    const changes = { name: req.body.name };
    users
      .update(id, changes)
      .then((user) => res.status(200).json(user))
      .catch((err) =>
        res.status(404).json({ message: "kullanıcı eklenemedi" })
      );
  }
);

// KULLANICI SİLİNİYOR, FAKAT SİLİNEN KULLANICI DÖNDÜRÜLEMEDİ
router.delete("/:id", md.validateUserId, (req, res) => {
  // SON SİLİNEN USER NESNESİ DÖNDÜRÜN
  // user id yi doğrulayan bir ara yazılım gereklidir.
  const { id } = req.params;
  // const deletedUser =  users.getById(id);
  users
    .remove(id)
    .then(() =>
      users
        .getById(id)
        .then((user) => res.status(200).json(user))
        .catch((err) =>
          res
            .status(500)
            .json({ message: "silinen kullanıcı bilgisi döndürülemedi" })
        )
    )
    .catch((err) =>
      res.status(400).json({ message: "kullanıcı silinirken hata oluştu" })
    );
});

router.get("/:id/posts", md.validateUserId, (req, res) => {
  // USER POSTLARINI İÇEREN BİR DİZİ DÖNDÜRÜN
  // user id yi doğrulayan bir ara yazılım gereklidir.
  const { id } = req.params;
  users
    .getUserPosts(id)
    .then((posts) => res.status(200).json(posts))
    .catch((err) =>
      res.status(400).json({ message: "kullanıcı postları döndürülemedi" })
    );
});

router.post("/:id/posts", (req, res) => {
  // YENİ OLUŞTURULAN KULLANICI NESNESİNİ DÖNDÜRÜN
  // user id yi doğrulayan bir ara yazılım gereklidir.
  // ve istek gövdesini doğrulayan bir ara yazılım gereklidir.
});

// routerı dışa aktarmayı unutmayın

module.exports = router;
