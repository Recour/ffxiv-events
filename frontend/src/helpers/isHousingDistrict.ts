export const isHousingDistrict = (map: string) => {
  return ["The Lavender Beds", "Mist", "The Goblet", "Shirogane", "Empyreum"].includes(map)
    || (
      ["Private Cottage", "Private House", "Private Mansion", "Private Chambers", "Apartment"].some(substring => map.includes(substring))
      && ["Lobby"].every(substring => !map.includes(substring))
    );
}
