function isGmail(email) {
    return typeof email === "string" && /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(email);
}

function check_phone(phone) {
  try {
      if(!/^\d[0-9]{11}$/.test(phone)) {
          throw new Error("Telefon raqam noto'g'ri!");
      }

      let raqamdavlatqodi = phone.slice(0, 3);
      let asosiyqismi = phone.slice(3, 5);
      let birinchiqismi = phone.slice(5, 8);
      let ikkinchiqismi = phone.slice(8, 10);
      let oxirgiqismi = phone.slice(10, 12);

      return `+${raqamdavlatqodi}(${asosiyqismi})${birinchiqismi}-${ikkinchiqismi}-${oxirgiqismi}`;

  } catch(e) {
      console.log(e.message);
  }
}

module.exports = {isGmail, check_phone};
