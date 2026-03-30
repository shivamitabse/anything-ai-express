import bcrypt from "bcrypt";

const password = "password"; // your admin password

const hashPassword = async () => {
  const saltRounds = 10;
  const hashed = await bcrypt.hash(password, saltRounds);
  console.log("Hashed Password:", hashed);
};

hashPassword();
