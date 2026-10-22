/* ============================================================
   BUBU Studio — Image Descriptions (editable)
   ------------------------------------------------------------
   Change the texts in this file and redeploy. No HTML editing needed.
   Each entry: { file, title, text }
   ============================================================ */

const ATELIER_PIECES = [
  { file: "jan_fechner-tufting_01-17.jpg", title: "Crimson Drift",
    text: "Chestnut and berry tones with a pulsing magenta seam. A study for a warm winter edition with an earthy base and a single heat accent." },
  { file: "jan_fechner-tufting_03-16.jpg", title: "Acid Bloom",
    text: "Acid green meets deep violet at the highest contrast point of the series. Inspired by Troodos pines after summer rain." },
  { file: "jan_fechner-tufting_04-15.jpg", title: "Citrus Forest",
    text: "Mandarin orange drips through fresh lime green. A summer reading of the Paphos citrus world translated into wool." },
  { file: "jan_fechner-tufting_08-18.jpg", title: "Cotton Candy",
    text: "Lavender and rose gradients in powdery softness. A quiet morning reflection in the desaturated end of the Aphrodite family." },
  { file: "jan_fechner-tufting_11-24.jpg", title: "Sunset Flow",
    text: "Lavender crown, magenta middle, a poured orange base. A classic Aphrodite Sunset composition in mid size." },
  { file: "jan_fechner-tufting_12-19.jpg", title: "Saffron Dream",
    text: "Saffron yellow layered over plum and pistachio. The warmest point of the Carob and Saffron family." },
  { file: "jan_fechner-tufting_17-14.jpg", title: "Lilac Cascade",
    text: "Lilac runs over rose and lands in a dense, saturated orange. A study for a future floor edition." },
  { file: "jan_fechner-tufting_18-13.jpg", title: "Cotton Sherbet",
    text: "Sky blue softens into cool pink and pours into a warm mango base. The most gentle transition in the series." },
  { file: "jan_fechner-tufting_19-12.jpg", title: "Meadow Bloom",
    text: "Pistachio and magenta embrace each other in front of a luminous mandarin drip. An energetic reading of Mediterranean meadows." },
  { file: "jan_fechner-tufting_21-11.jpg", title: "Peach Sky",
    text: "Lavender clouds, coral middle, pure orange below. A sunset captured across three moments in time." },
  { file: "jan_fechner-tufting_22-10.jpg", title: "Cream Coral",
    text: "Creamy off white melts into pink and a saturated orange. The brightest voice in the Aphrodite family." },
  { file: "jan_fechner-tufting_23-9.jpg", title: "Pure Mandarine",
    text: "A monochrome mandarin drip with a soft apricot field on top moving into full orange. A study in concentration." },
  { file: "jan_fechner-tufting_25-7.jpg", title: "Pink Flame",
    text: "Creamy beige softens into flame pink and apricot. A slim, almost sculptural silhouette." },
  { file: "jan_fechner-tufting_26-6.jpg", title: "Berry Cream",
    text: "Magenta berries on top, sandy vanilla below. A study for a quieter, dessert like palette." },
  { file: "jan_fechner-tufting_27-5.jpg", title: "Saffron Bloom",
    text: "Pure saffron yellow with pistachio drips. The warmest solo voice in the Carob family." },
  { file: "jan_fechner-tufting_28-4.jpg", title: "Spring Thaw",
    text: "Mint green peak, sandy middle, fresh lime feet. A meltwater study translated into pastels." },
  { file: "jan_fechner-tufting_29-3.jpg", title: "Rose Sand",
    text: "Deep berry rose fades into sand and vanilla. Romantic elegance with a North African warmth." },
  { file: "jan_fechner-tufting_30-2.jpg", title: "Mint Meadow",
    text: "Ice cream mint meets apricot cream and ends in juicy green. The calmest and freshest composition in the series." }
];

const LANDSCAPE_INSTALLATIONS = [
  { file: "jan_fechner_bubu_studio_drip_collage_02_image-23.jpg", title: "Wall of Drips on Limestone",
    text: "Four Liquid Mountains pieces on a limestone cliff near Paphos. Pink magenta, lilac orange, apricot mint and mint cream side by side as the first ensemble statement of the collection." },
  { file: "jan_fechner_bubu_studio_drip_collage_04_image-20.jpg", title: "Olive Grove Installation",
    text: "Five Liquid Mountains pieces spread along a limestone formation in an olive grove. The Mediterranean sits in the background so the drips become part of the landscape instead of a foreign body." },
  { file: "land_01_orange_red-26.jpg", title: "Sunset Flame Outdoor",
    text: "A Liquid Mountains drip in orange and crimson alone on a weathered rock face next to an olive stump. The warmest solo moment of the outdoor reading." },
  { file: "land_02_pink_mustard-25.jpg", title: "Rose and Mustard Field",
    text: "A soft pink Liquid Mountains drip with a mustard yellow base in the Paphos hills. A study about contrast between a tender piece and the rough geology around it." }
];

// External access for the gallery renderer
window.BUBU_DATA = { ATELIER_PIECES, LANDSCAPE_INSTALLATIONS };
