import { compare, hash } from "bcryptjs";

exports.doHash = (value, saltValue) => {
    return hash(value, saltValue);
}

exports.doHashValidation = (value, hashedValue) => {
    return compare(value, hashedValue);
}

