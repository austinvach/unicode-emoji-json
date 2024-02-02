const fs = require('fs')
const orderedEmojiData = fs.readFileSync('./emoji-order.txt', 'utf-8')
const groupedEmojiData = fs.readFileSync('./emoji-group.txt', 'utf-8')
const VARIATION_16 = String.fromCodePoint(0xfe0f)
const SKIN_TONE_VARIATION_DESC = /\sskin\stone(?:,|$)/
const findReplace = {
  "a_button": "a_button_blood_type",
  "ab_button": "ab_button_blood_type",
  "b_button": "b_button_blood_type",
  "black_bird": "blackbird",
  "black_medium_small_square": "black_medium-small_square",
  "deaf_man": "man_deaf",
  "deaf_person": "person_deaf",
  "deaf_woman": "woman_deaf",
  "dotted_six_pointed_star": "dotted_six-pointed_star",
  "down_left_arrow": "down-left_arrow",
  "down_right_arrow": "down-right_arrow",
  "e_mail": "e-mail",
  "eight_o_clock": "eight_oclock",
  "eight_pointed_star": "eight-pointed_star",
  "eight_spoked_asterisk": "eight-spoked_asterisk",
  "eight_thirty": "eight-thirty",
  "eleven_o_clock": "eleven_oclock",
  "eleven_thirty": "eleven-thirty",
  "elf": "person_elf",
  "enraged_face": "pouting_face",
  "face_with_crossed_out_eyes": "dizzy",
  "face_with_head_bandage": "face_with_head-bandage",
  "fairy": "person_fairy",
  "fast_forward_button": "fast-forward_button",
  "five_o_clock": "five_oclock",
  "five_thirty": "five-thirty",
  "fleur_de_lis": "fleur-de-lis",
  "four_o_clock": "four_oclock",
  "four_thirty": "four-thirty",
  "front_facing_baby_chick": "front-facing_baby_chick",
  "genie": "person_genie",
  "globe_showing_asia_australia": "globe_showing_asia-australia",
  "globe_showing_europe_africa": "globe_showing_europe-africa",
  "hear_no_evil_monkey": "hear-no-evil_monkey",
  "high_heeled_shoe": "high-heeled_shoe",
  "high_speed_train": "high-speed_train",
  "jack_o_lantern": "jack-o-lantern",
  "keycap_number_sign": "keycap_hashtag",
  "left_facing_fist": "left-facing_fist",
  "left_right_arrow": "left-right_arrow",
  "love_you_gesture": "love-you_gesture",
  "mage": "person_mage",
  "man_blond_hair": "man_blonde_hair",
  "man_s_shoe": "mans_shoe",
  "men_s_room": "mens_room",
  "men_with_bunny_ears": "man_with_bunny_ears",
  "men_wrestling": "man_wrestling",
  "mermaid": "woman_merpeople",
  "merman": "man_merpeople",
  "merperson": "person_merpeople",
  "money_mouth_face": "money-mouth_face",
  "nine_o_clock": "nine_oclock",
  "nine_thirty": "nine-thirty",
  "non_potable_water": "non-potable_water",
  "o_button": "o_button_(blood_type)",
  "on_arrow": "on!_arrow",
  "one_o_clock": "one_oclock",
  "one_piece_swimsuit": "one-piece_swimsuit",
  "one_thirty": "one-thirty",
  "people_with_bunny_ears": "person_with_bunny_ears",
  "people_wrestling": "person_wrestling",
  "pinata": "piñata",
  "red_triangle_pointed_up": "red_triangle",
  "rescue_worker_s_helmet": "rescue_workers_helmet",
  "right_facing_fist": "right-facing_fist",
  "rolled_up_newspaper": "rolled-up_newspaper",
  "see_no_evil_monkey": "see-no-evil_monkey",
  "seven_o_clock": "seven_oclock",
  "seven_thirty": "seven-thirty",
  "six_o_clock": "six_oclock",
  "six_thirty": "six-thirty",
  "smiling_cat_with_heart_eyes": "smiling_cat_with_heart-eyes",
  "smiling_face_with_heart_eyes": "smiling_face_with_heart-eyes",
  "smiling_face_with_open_hands": "hugging_face",
  "snow_capped_mountain": "snow-capped_mountain",
  "speak_no_evil_monkey": "speak-no-evil_monkey",
  "star_struck": "star-struck",
  "superhero": "person_superhero",
  "supervillain": "person_supervillain",
  "t_rex": "t-rex",
  "t_shirt": "t-shirt",
  "tear_off_calendar": "tear-off_calendar",
  "ten_o_clock": "ten_oclock",
  "ten_thirty": "ten-thirty",
  "three_o_clock": "three_oclock",
  "three_thirty": "three-thirty",
  "twelve_o_clock": "twelve_oclock",
  "twelve_thirty": "twelve-thirty",
  "two_hump_camel": "two-hump_camel",
  "two_o_clock": "two_oclock",
  "two_thirty": "two-thirty",
  "up_button": "up!_button",
  "up_down_arrow": "up-down_arrow",
  "up_left_arrow": "up-left_arrow",
  "up_right_arrow": "up-right_arrow",
  "upside_down_face": "upside-down_face",
  "vampire": "person_vampire",
  "white_medium_small_square": "white_medium-small_square",
  "woman_blond_hair": "woman_blonde_hair",
  "woman_s_boot": "womans_boot",
  "woman_s_clothes": "womans_clothes",
  "woman_s_hat": "womans_hat",
  "woman_s_sandal": "womans_sandal",
  "women_s_room": "womens_room",
  "women_with_bunny_ears": "woman_with_bunny_ears",
  "women_wrestling": "woman_wrestling",
  "x_ray": "x-ray",
  "yo_yo": "yo-yo",
  "zipper_mouth_face": "zipper-mouth_face",
  "zombie": "person_zombie"
}
const noSkinToneSupport = ["handshake"]
const svgUnavailable = [
  "technologist",
  "man_technologist",
  "woman_technologist",
  "people_holding_hands",
  "women_holding_hands",
  "woman_and_man_holding_hands",
  "men_holding_hands",
  "kiss",
  "kiss_woman_man",
  "kiss_man_man",
  "kiss_woman_woman",
  "couple_with_heart",
  "couple_with_heart_woman_man",
  "couple_with_heart_man_man",
  "couple_with_heart_woman_woman",
  "family",
  "family_man_woman_boy",
  "family_man_woman_girl",
  "family_man_woman_girl_boy",
  "family_man_woman_boy_boy",
  "family_man_woman_girl_girl",
  "family_man_man_boy",
  "family_man_man_girl",
  "family_man_man_girl_boy",
  "family_man_man_boy_boy",
  "family_man_man_girl_girl",
  "family_woman_woman_boy",
  "family_woman_woman_girl",
  "family_woman_woman_girl_boy",
  "family_woman_woman_boy_boy",
  "family_woman_woman_girl_girl",
  "family_man_boy",
  "family_man_boy_boy",
  "family_man_girl",
  "family_man_girl_boy",
  "family_man_girl_girl",
  "family_woman_boy",
  "family_woman_boy_boy",
  "family_woman_girl",
  "family_woman_girl_boy",
  "family_woman_girl_girl",
  "video_game",
  "paperclip",
  "flag_clipperton_island",
  "flag_cocos_islands",
  "flag_dominican_republic",
  "flag_albania",
  "flag_antigua_barbuda",
  "flag_belgium",
  "flag_botswana",
  "flag_belarus",
  "flag_burkina_faso",
  "flag_bermuda",
  "flag_antarctica",
  "flag_bahamas",
  "flag_congo_kinshasa",
  "flag_bosnia_herzegovina",
  "flag_western_sahara",
  "flag_djibouti",
  "flag_bouvet_island",
  "flag_germany",
  "flag_argentina",
  "flag_cyprus",
  "flag_algeria",
  "flag_ecuador",
  "flag_china",
  "flag_georgia",
  "flag_austria",
  "flag_aruba",
  "flag_colombia",
  "flag_curacao",
  "flag_australia",
  "flag_st_barthelemy",
  "flag_burundi",
  "flag_grenada",
  "flag_andorra",
  "flag_dominica",
  "flag_angola",
  "flag_anguilla",
  "flag_costa_rica",
  "flag_congo_brazzaville",
  "flag_bolivia",
  "flag_faroe_islands",
  "flag_brazil",
  "flag_central_african_republic",
  "flag_canary_islands",
  "flag_kazakhstan",
  "flag_luxembourg",
  "flag_south_korea",
  "flag_guatemala",
  "flag_hong_kong_sar_china",
  "flag_guyana",
  "flag_iran",
  "flag_macao_sar_china",
  "flag_laos",
  "flag_heard_mcdonald_islands",
  "flag_isle_of_man",
  "flag_panama",
  "flag_mauritius",
  "flag_kuwait",
  "flag_comoros",
  "flag_guinea_bissau",
  "flag_guernsey",
  "flag_lesotho",
  "flag_iceland",
  "flag_niue",
  "flag_gibraltar",
  "flag_montenegro",
  "flag_greece",
  "flag_jamaica",
  "flag_nepal",
  "flag_gambia",
  "flag_pakistan",
  "flag_hungary",
  "flag_india",
  "flag_north_korea",
  "flag_israel",
  "flag_mexico",
  "flag_new_caledonia",
  "flag_greenland",
  "flag_st_martin",
  "flag_netherlands",
  "flag_mali",
  "flag_indonesia",
  "flag_niger",
  "flag_moldova",
  "flag_malawi",
  "flag_st_kitts_nevis",
  "flag_lithuania",
  "flag_libya",
  "flag_honduras",
  "flag_martinique",
  "flag_oman",
  "flag_ireland",
  "flag_croatia",
  "flag_mozambique",
  "flag_mongolia",
  "flag_philippines",
  "flag_papua_new_guinea",
  "flag_kenya",
  "flag_jersey",
  "flag_haiti",
  "flag_kiribati",
  "flag_guam",
  "flag_jordan",
  "flag_st_lucia",
  "flag_malaysia",
  "flag_japan",
  "flag_morocco",
  "flag_south_georgia_south_sandwich_islands",
  "flag_equatorial_guinea",
  "flag_latvia",
  "flag_malta",
  "flag_new_zealand",
  "flag_nigeria",
  "flag_northern_mariana_islands",
  "flag_cayman_islands",
  "flag_french_polynesia",
  "flag_monaco",
  "flag_peru",
  "flag_norfolk_island",
  "flag_iraq",
  "flag_italy",
  "flag_cambodia",
  "flag_nicaragua",
  "flag_liechtenstein",
  "flag_marshall_islands",
  "flag_british_indian_ocean_territory",
  "flag_madagascar",
  "flag_kyrgyzstan",
  "flag_maldives",
  "flag_ghana",
  "flag_namibia",
  "flag_guadeloupe",
  "flag_montserrat",
  "flag_guinea",
  "flag_myanmar",
  "flag_liberia",
  "flag_french_guiana",
  "flag_sri_lanka",
  "flag_nauru",
  "flag_mauritania",
  "flag_norway",
  "flag_north_macedonia",
  "flag_lebanon",
  "flag_portugal",
  "flag_tristan_da_cunha",
  "flag_sierra_leone",
  "flag_eswatini",
  "flag_england",
  "flag_scotland",
  "flag_united_states",
  "flag_paraguay",
  "flag_pitcairn_islands",
  "flag_el_salvador",
  "flag_trinidad_tobago",
  "flag_turkey",
  "flag_british_virgin_islands",
  "flag_vatican_city",
  "flag_suriname",
  "flag_mayotte",
  "flag_sweden",
  "flag_uzbekistan",
  "flag_reunion",
  "flag_st_helena",
  "flag_south_sudan",
  "flag_u_s_outlying_islands",
  "flag_san_marino",
  "flag_serbia",
  "flag_romania",
  "flag_tuvalu",
  "flag_united_nations",
  "flag_rwanda",
  "flag_vietnam",
  "flag_yemen",
  "flag_south_africa",
  "flag_tajikistan",
  "flag_saudi_arabia",
  "flag_uganda",
  "flag_samoa",
  "flag_puerto_rico",
  "flag_ukraine",
  "flag_wales",
  "flag_vanuatu",
  "flag_tunisia",
  "flag_zambia",
  "flag_senegal",
  "flag_st_pierre_miquelon",
  "flag_turkmenistan",
  "flag_singapore",
  "flag_wallis_futuna",
  "flag_syria",
  "flag_venezuela",
  "flag_tonga",
  "flag_sao_tome_principe",
  "flag_somalia",
  "flag_togo",
  "flag_palestinian_territories",
  "flag_seychelles",
  "flag_palau",
  "flag_chad",
  "flag_solomon_islands",
  "flag_qatar",
  "flag_slovakia",
  "flag_thailand",
  "flag_zimbabwe",
  "flag_taiwan",
  "flag_french_southern_territories",
  "flag_timor_leste",
  "flag_tanzania",
  "flag_tokelau",
  "flag_u_s_virgin_islands",
  "flag_sint_maarten",
  "flag_russia",
  "flag_poland",
  "flag_st_vincent_grenadines",
  "flag_svalbard_jan_mayen",
  "flag_turks_caicos_islands",
  "flag_slovenia",
  "flag_uruguay",
  "flag_kosovo",
  "flag_sudan",
  "flag_ascension_island",
  "flag_united_arab_emirates",
  "flag_afghanistan",
  "flag_armenia",
  "flag_american_samoa",
  "flag_aland_islands",
  "flag_azerbaijan",
  "flag_barbados",
  "flag_bangladesh",
  "flag_bulgaria",
  "flag_bahrain",
  "flag_brunei",
  "flag_caribbean_netherlands",
  "flag_benin",
  "flag_bhutan",
  "flag_belize",
  "flag_canada",
  "flag_switzerland",
  "flag_cote_d_ivoire",
  "flag_cook_islands",
  "flag_chile",
  "flag_cameroon",
  "flag_cuba",
  "flag_cape_verde",
  "flag_christmas_island",
  "flag_czechia",
  "flag_diego_garcia",
  "flag_denmark",
  "flag_ceuta_melilla",
  "flag_estonia",
  "flag_egypt",
  "flag_eritrea",
  "flag_spain",
  "flag_ethiopia",
  "flag_european_union",
  "flag_finland",
  "flag_fiji",
  "flag_falkland_islands",
  "flag_micronesia",
  "flag_france",
  "flag_gabon",
  "flag_united_kingdom"
]
const excludedEmoji = [
  "middle_finger",
  "person",
  "person_blond_hair",
  "person_beard",
  "person_red_hair",
  "person_curly_hair",
  "person_white_hair",
  "person_bald",
  "older_person",
  "person_frowning",
  "person_pouting",
  "person_gesturing_no",
  "person_gesturing_ok",
  "person_tipping_hand",
  "person_raising_hand",
  "person_facepalming",
  "person_shrugging",
  "health_worker",
  "student",
  "teacher",
  "judge",
  "farmer",
  "cook",
  "mechanic",
  "factory_worker",
  "office_worker",
  "scientist",
  "singer",
  "artist",
  "pilot",
  "astronaut",
  "firefighter",
  "police_officer",
  "person_deaf",
  "person_bowing",
  "detective",
  "guard",
  "child",
  "construction_worker",
  "person_with_crown",
  "person_wearing_turban",
  "person_feeding_baby",
  "person_in_tuxedo",
  "person_with_veil",
  "woman_beard",
  "woman_office_worker",
  "woman_in_tuxedo",
  "man_with_veil",
  "pregnant_man",
  "pregnant_person",
  "mx_claus",
  "person_superhero",
  "person_supervillain",
  "person_with_bunny_ears",
  "person_mage",
  "person_fairy",
  "person_vampire",
  "person_merpeople",
  "person_elf",
  "person_genie",
  "person_zombie",
  "person_getting_massage",
  "person_getting_haircut",
  "person_walking",
  "person_standing",
  "person_kneeling",
  "person_with_white_cane",
  "person_in_motorized_wheelchair",
  "person_in_manual_wheelchair",
  "person_in_steamy_room",
  "person_climbing",
  "person_running",
  "person_golfing",
  "person_surfing",
  "person_rowing_boat",
  "person_swimming",
  "person_bouncing_ball",
  "person_lifting_weights",
  "person_biking",
  "person_mountain_biking",
  "person_cartwheeling",
  "person_wrestling",
  "person_playing_water_polo",
  "person_playing_handball",
  "person_juggling",
  "person_in_lotus_position",
  "man_with_bunny_ears",
  "transgender_symbol",
  "rainbow_flag",
  "transgender_flag"
]

// Final data holder
const orderedEmoji = []
const dataByEmoji = {}
const dataByGroup = []
const emojiComponents = {}

// The group data tells if the emoji is one of the following:
//   component
//   fully-qualified
//   minimally-qualified
//   unqualified
//
// We only want fully-qualified emoji in the output data

// # group: Smileys & Emotion
//          |1--------------|
//
const GROUP_REGEX = /^#\sgroup:\s(?<name>.+)/

// 1F646 200D 2640 FE0F                       ; fully-qualified     # 🙆‍♀️ E4.0 woman gesturing OK
//                                              |1------------|      |2--||3-| |4---------------|
// 1F469 200D 1F469 200D 1F467 200D 1F467     ; fully-qualified     # 👩‍👩‍👧‍👧 E2.0 family: woman, woman, girl, girl
//                                              |1------------|      |2-| |3| |4-----------------------------|
//
const EMOJI_REGEX = /^[^#]+;\s(?<type>[\w-]+)\s+#\s(?<emoji>\S+)\sE(?<emojiversion>\d+\.\d)\s(?<desc>.+)/
let currentGroup = null

groupedEmojiData.split('\n').forEach(line => {
  const groupMatch = line.match(GROUP_REGEX)
  if (groupMatch) {
    if (groupMatch.groups.name === "Symbols" || groupMatch.groups.name === "Flags") {
      currentGroup = "Symbols & Flags"
    }
    else {
      currentGroup = groupMatch.groups.name
    }
    //currentGroup = groupMatch.groups.name
  } else {
    const emojiMatch = line.match(EMOJI_REGEX)
    if (emojiMatch) {
      const { groups: { type, emoji, desc, emojiversion } } = emojiMatch
      if (type === 'fully-qualified') {
        if (line.match(SKIN_TONE_VARIATION_DESC)) return
        dataByEmoji[emoji] = {
          name: null,
          slug: null,
          group: currentGroup,
          emoji_version: emojiversion,
          unicode_version: null,
          skin_tone_support: null
        }
      } else if (type === 'component') {
        emojiComponents[slugify(desc)] = emoji
      }
    }
  }
})


// 'flag: St. Kitts & Nevis' -> 'flag_st_kitts_nevis'
// 'family: woman, woman, boy, boy' -> 'family_woman_woman_boy_boy'
// 'A button (blood type)' -> 'a_button'
// 'Cocos (Keeling) Islands' -> 'cocos_islands'
// 'keycap *' -> 'keycap_asterisk'
//
// Returns machine readable emoji short code
function slugify(str) {
  const SLUGIFY_REPLACEMENT = {
    "*": "asterisk",
    "#": "number sign"
  }

  for (key in SLUGIFY_REPLACEMENT) {
    str = str.replace(key, SLUGIFY_REPLACEMENT[key])
  }

  str = str.normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\(.+\)/g, '')
    .trim()
    .replace(/[\W|_]+/g, '_').toLowerCase()

  // AV EDIT (1/4)
  str = replaceString(str, findReplace);
  return str;
  // END OF EDIT
}

// AV EDIT (2/4)
function replaceString(string, keyMap) {
  // Check if the string is a key in the key map
  if (keyMap.hasOwnProperty(string)) {
    // If yes, return the value from the key map
    return keyMap[string];
  } else {
    // If no, return the original string
    return string;
  }
}
// END OF EDIT

// U+1F44B ; 6.0 # 👋 waving hand
//          |1--| |2-|3----------|
//
// U+1F442 U+1F3FB ; 8.0 # 👂🏻 ear: light skin tone
//                  |1--| |2-|3--||4--------------|
//
// U+1F469 U+200D U+1F467 U+200D U+1F467 ; 6.0 # 👩‍👧‍👧 family: woman, girl, girl
//                                        |1--| |2-|3-----||4----------------|
//
const ORDERED_EMOJI_REGEX = /.+\s;\s(?<version>[0-9.]+)\s#\s(?<emoji>\S+)\s(?<name>[^:]+)(?::\s)?(?<desc>.+)?/

let currentEmoji = null

orderedEmojiData.split('\n').forEach(line => {
  if (line.length === 0) return
  const match = line.match(ORDERED_EMOJI_REGEX)
  if (!match) return

  const { groups: { version, emoji, name, desc } } = match
  const isSkinToneVariation = desc && !!desc.match(SKIN_TONE_VARIATION_DESC)
  const fullName = desc && !isSkinToneVariation ? [name, desc].join(' ') : name
  if (isSkinToneVariation) {
    dataByEmoji[currentEmoji].skin_tone_support = true
    dataByEmoji[currentEmoji].skin_tone_support_unicode_version = version
  } else {
    // Workaround for ordered data missing VARIATION_16 (smiling_face)
    emojiWithOptionalVariation16 = dataByEmoji[emoji] ? emoji : emoji + VARIATION_16
    const emojiEntry = dataByEmoji[emojiWithOptionalVariation16]
    if (!emojiEntry) {
      if (Object.values(emojiComponents).includes(emoji)) return
      throw `${emoji} entry from emoji-order.txt match not found in emoji-group.txt`
    }
    currentEmoji = emojiWithOptionalVariation16

    dataByEmoji[currentEmoji].name = fullName
    dataByEmoji[currentEmoji].slug = slugify(fullName)
    dataByEmoji[currentEmoji].unicode_version = version
    dataByEmoji[currentEmoji].skin_tone_support = false

    // AV EDIT (3/4)
    if (!svgUnavailable.includes(dataByEmoji[currentEmoji].slug) && !excludedEmoji.includes(dataByEmoji[currentEmoji].slug)) {
      orderedEmoji.push(currentEmoji)
    }
    // END OF EDIT
  }

  // AV EDIT (4/4)
  if (noSkinToneSupport.includes(dataByEmoji[currentEmoji].slug)) {
    dataByEmoji[currentEmoji].skin_tone_support = false
  }
  // END OF EDIT
})

for (const emoji of orderedEmoji) {
  const { group, skin_tone_support, skin_tone_support_unicode_version, name, slug, emoji_version, unicode_version } = dataByEmoji[emoji]
  let groupIndex = dataByGroup.findIndex((element) => element.name === group)
  if (groupIndex === - 1) {
    dataByGroup.push({ name: group, slug: slugify(group), emojis: [] })
    groupIndex = dataByGroup.findIndex((element) => element.name === group)
  }
  dataByGroup[groupIndex].emojis.push({
    emoji,
    skin_tone_support,
    skin_tone_support_unicode_version,
    name,
    slug,
    unicode_version,
    emoji_version
  })
}

// {
//   "Smileys & Emotion": [
//     {
//       "emoji": "😀",
//       "skin_tone_support": false,
//       "name": "grinning face",
//       "slug": "grinning_face",
//       "version": "6.1"
//     },
//   ],
//   ...
// }
fs.writeFileSync('data-by-group.json', JSON.stringify(dataByGroup, null, 2))