const User = require("../model/user.model");
const Region = require("../model/region.model");
const bcrypt = require("bcrypt");

async function initData() {
    try {
        const regionName = "Toshkent";
        let region = await Region.findOne({ where: { name: regionName } });

        if (!region) {
            region = await Region.create({ name: regionName }); 
            console.log(`Region yaratildi: ${regionName}`);
        } else {
            console.log(`Region allaqachon mavjud: ${regionName}`);
        }

        const adminExists = await User.findOne({ where: { role: "ADMIN" } });

        if (!adminExists) {
            await User.create({
                fullName: "Admin User",
                year: "2000-01-01",
                phone: "+998901234567",
                email: "admin@example.com",
                password: bcrypt.hashSync("admin123", 10),
                role: "ADMIN",
                region_id: region.id 
            });
            console.log("Admin yaratildi!");
        } else {
            console.log("Admin allaqachon mavjud!");
        }

    } catch (error) {
        console.error("Ma'lumotlarni yaratishda xatolik:", error);
    }
}

module.exports = { initData };
