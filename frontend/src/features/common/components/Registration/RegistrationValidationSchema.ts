import * as Yup from "yup";

export const RegistrationValidationSchema = Yup.object().shape({
    name: Yup.string().required("Поле является обязательным"),
    login: Yup.string().required("Поле является обязательным")
        .matches(/^[a-zA-Z][a-zA-Z0-9-_\.]{3,19}$/,
            "Только латинские буквы и цифры, первый символ — буква, длина от 4 до 20 символов"),
    email: Yup.string().email("Некорректный email").required("Поле является обязательным"),
    password: Yup.string().required("Поле является обязательным")
        .matches(/(?=.*[0-9])(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z!@#$%^&*]{6,}/,
            "Не менее 6 символов: как минимум одна заглавная буква, одна цифра и один специальный символ")
    }
);