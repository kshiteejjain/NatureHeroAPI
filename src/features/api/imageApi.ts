export const getImages = (username: string) => {
    return JSON.parse(localStorage.getItem(username) || '[]');
};

export const saveImages = (username: string, images: { name: string, gender: string, ageRange: string, file: File }[]) => {
    localStorage.setItem(username, JSON.stringify(images));
};
