const allowedDomains = [
  "gmail.com",
  "facebook.com",
  "hotmail.com",
  "outlook.com",
  "live.com",
  "icloud.com",
  "me.com",
  "mac.com",
  "aol.com",
  "zoho.com",
  "protonmail.com",
  "yandex.com",
  "mail.com",
  "gmx.com",
  "fastmail.com",
  "yahoo.com",
  "ymail.com",
  "linkedin.com",
  "github.com",
  "twitter.com",
  "orange.fr",
  "free.fr",
  "sfr.fr",
  "t-online.de",
  "mail.ru",
  "hotmail.fr",
];

function validateEmailDomain(email) {
  if (!email) {
    throw new Error("Email is required");
  }

  const domain = email.split("@")[1];
  if (!domain) {
    throw new Error("Invalid email format");
  }

  if (!allowedDomains.includes(domain)) {
    throw new Error(
      "Invalid email domain. We do not accept fake or temporary emails."
    );
  }

  return true;
}

module.exports = {
  validateEmailDomain,
  allowedDomains,
};
