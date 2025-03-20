import axios from "axios";

const api = axios.create({
    baseURL: "https://notify.eskiz.uz/api/",
    headers: {
        Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3NDM5NDA2MzYsImlhdCI6MTc0MTM0ODYzNiwicm9sZSI6InRlc3QiLCJzaWduIjoiODk0MmZlYTAzODU1NGVmZWUzYjgzMzFjYzJjZGU0NTkzMzQxZjRiNzk2ZGJmZmI3M2IxZTE2ZTQ5YzYzNmEwYiIsInN1YiI6Ijk4NzYifQ.fIGzphUF7rjNQLDBna11HgyryDRLufZVuieQ60PUnCQ"
    }
});

export async function sendSms(tel, otp) {
    try {
        await api.post("message/sms/send", {
            mobile_phone: tel,
            message: `Bu Eskiz dan test`
        });

        console.log("SMS jo'natildi:", otp, tel);
    } catch (error) {
        console.log("SMS jo'natishda xato:", error);
    }
}
