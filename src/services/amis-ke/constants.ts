
// All 47 Kenyan counties
export const kenyaCounties = [
  "Mombasa", "Kwale", "Kilifi", "Tana River", "Lamu", "Taita-Taveta", "Garissa", 
  "Wajir", "Mandera", "Marsabit", "Isiolo", "Meru", "Tharaka-Nithi", "Embu", 
  "Kitui", "Machakos", "Makueni", "Nyandarua", "Nyeri", "Kirinyaga", "Murang'a", 
  "Kiambu", "Turkana", "West Pokot", "Samburu", "Trans Nzoia", "Uasin Gishu", 
  "Elgeyo-Marakwet", "Nandi", "Baringo", "Laikipia", "Nakuru", "Narok", "Kajiado", 
  "Kericho", "Bomet", "Kakamega", "Vihiga", "Bungoma", "Busia", "Siaya", "Kisumu", 
  "Homa Bay", "Migori", "Kisii", "Nyamira", "Nairobi"
];

// Common agricultural commodities in Kenya
export const commodities = [
  "Maize", "Beans", "Rice", "Potatoes", "Tomatoes", "Onions", "Cabbage", 
  "Kale (Sukuma Wiki)", "Green Grams", "Cassava", "Sweet Potatoes", "Bananas", 
  "Avocados", "Mangoes", "Oranges", "Coffee", "Tea", "Sugar Cane", "Cotton", 
  "Wheat", "Sorghum", "Millet", "Cowpeas", "Groundnuts", "Soybeans"
];

// Major markets across Kenya
export const markets = [
  "Wakulima Market", "Kongowea Market", "Nakuru Main Market", "Kibuye Market", 
  "Eldoret Main Market", "Garissa Livestock Market", "Karatina Market",
  "Kisumu Fish Market", "Nyeri Open Air Market", "Kakamega Municipal Market",
  "Machakos Central Market", "Meru Municipal Market", "Kitale Municipal Market",
  "Wajir Livestock Market", "Embu Municipal Market", "Kericho Market",
  "Bungoma Municipal Market", "Malindi Market", "Kitui Market", "Nyahururu Market"
];

// More realistic base prices based on commodity
export const basePriceMap: Record<string, number> = {
  "Maize": 50,
  "Beans": 120,
  "Rice": 130,
  "Potatoes": 40,
  "Tomatoes": 80,
  "Onions": 100,
  "Cabbage": 60,
  "Kale (Sukuma Wiki)": 30,
  "Green Grams": 150,
  "Cassava": 35,
  "Sweet Potatoes": 45,
  "Bananas": 20,
  "Avocados": 25,
  "Mangoes": 15,
  "Oranges": 12,
  "Coffee": 500,
  "Tea": 300,
  "Sugar Cane": 20,
  "Cotton": 80,
  "Wheat": 65,
  "Sorghum": 55,
  "Millet": 70,
  "Cowpeas": 90,
  "Groundnuts": 150,
  "Soybeans": 120
};

export const measureUnitMap: Record<string, string> = {
  "Maize": "Kg",
  "Beans": "Kg",
  "Rice": "Kg",
  "Potatoes": "Kg",
  "Tomatoes": "Kg",
  "Onions": "Kg",
  "Cabbage": "Head",
  "Kale (Sukuma Wiki)": "Bundle",
  "Bananas": "Bunch",
  "Avocados": "Piece",
  "Mangoes": "Piece",
  "Oranges": "Piece",
  "Coffee": "Kg",
  "Tea": "Kg"
};
