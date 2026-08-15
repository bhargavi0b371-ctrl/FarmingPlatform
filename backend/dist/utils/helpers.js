import { v4 as uuidv4 } from 'uuid';
export const generateOTP = (length = 6) => {
    const digits = '0123456789';
    let otp = '';
    for (let i = 0; i < length; i++) {
        otp += digits[Math.floor(Math.random() * digits.length)];
    }
    return otp;
};
export const generateUUID = () => uuidv4();
export const formatPhoneNumber = (phone) => {
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.startsWith('91') && cleaned.length === 12)
        return `+${cleaned}`;
    if (cleaned.length === 10)
        return `+91${cleaned}`;
    return phone.startsWith('+') ? phone : `+${phone}`;
};
export const isEmailAddress = (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value.trim());
};
export const getSeason = (date) => {
    const month = date.getMonth();
    if (month >= 2 && month <= 4)
        return 'spring';
    if (month >= 5 && month <= 7)
        return 'summer';
    if (month >= 8 && month <= 10)
        return 'autumn';
    return 'winter';
};
export const cropRecommendations = {
    rice: { season: ['summer', 'autumn'], soil: ['alluvial', 'clay', 'loamy'], water: 'high' },
    wheat: { season: ['winter'], soil: ['alluvial', 'loamy', 'clay'], water: 'medium' },
    maize: { season: ['spring', 'summer'], soil: ['loamy', 'sandy'], water: 'medium' },
    cotton: { season: ['summer'], soil: ['black', 'alluvial'], water: 'low' },
    sugarcane: { season: ['spring'], soil: ['alluvial', 'loamy'], water: 'high' },
};
export const pestDatabase = {
    aphids: {
        type: 'pest',
        symptoms: ['Curling leaves', 'Yellow spots'],
        organicTreatment: ['Neem oil spray', 'Ladybugs'],
        chemicalTreatment: ['Imidacloprid'],
        prevention: ['Regular inspection', 'Remove weeds'],
    },
    leaf_blight: {
        type: 'disease',
        symptoms: ['Brown lesions', 'Yellow halos'],
        organicTreatment: ['Copper spray'],
        chemicalTreatment: ['Mancozeb'],
        prevention: ['Use disease-free seeds'],
    },
};
