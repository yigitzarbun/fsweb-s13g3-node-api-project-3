const users = require("./../users/users-model");

function logger(req, res, next) {
  console.log(`${new Date()} --- ${req.url}`);
  next();
}

function validateUserId(req, res, next) {
  const { id } = req.params;
  console.log("user id: ", id);
  const user = users.getById(id);

  if (user) {
    console.log("Kullanıcı var");
    next();
  } else {
    console.log("Böyle bir ID yok");
    next({ message: "Talep edilen bilgilerde hata var" });
  }
}

function validateUser(req, res, next) {
  // SİHRİNİZİ GÖRELİM
  const newUser = req.body.name;
  console.log(newUser);
  if (newUser) {
    console.log(" kullanıcı ismi bulunuyor");
    next();
  } else {
    console.log(" kullanıcı ismi girilmedi");
    next({ message: "Kullanıcı ismi girilmedi" });
  }
}

function validatePost(req, res, next) {
  const text = req.body.text;
  if (text) {
    console.log("text, body içerisinde mevcut");
    next();
  } else {
    console.log("text, body içerisinde yok");
    next({ mesaj: "gerekli text alanı eksik" });
  }
}

// bu işlevleri diğer modüllere değdirmeyi unutmayın
module.exports = {
  logger,
  validateUserId,
  validateUser,
  validatePost,
};
