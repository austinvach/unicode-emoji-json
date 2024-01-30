const fs = require('fs')
const orderedEmojiData = fs.readFileSync('./emoji-order.txt', 'utf-8')
const groupedEmojiData = fs.readFileSync('./emoji-group.txt', 'utf-8')
const VARIATION_16 = String.fromCodePoint(0xfe0f)
const SKIN_TONE_VARIATION_DESC = /\sskin\stone(?:,|$)/

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
    currentGroup = groupMatch.groups.name
  } else {
    const emojiMatch = line.match(EMOJI_REGEX)
    if (emojiMatch) {
      const {groups: {type, emoji, desc, emojiversion}} = emojiMatch
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
const keyMap = {
  "smiling_face_with_open_hands":	"hugging_face",
  "face_with_crossed_out_eyes":	"dizzy",
  "enraged_face":	"pouting_face",
  "deaf_person": "person_deaf",
  "deaf_man": "man_deaf",
  "deaf_woman": "woman_deaf",
  "superhero": "person_superhero",
  "supervillain": "person_supervillain",
  "mage": "person_mage",
  "fairy": "person_fairy",
  "vampire": "person_vampire",
  "merperson": "person_merpeople",
  "merman": "man_merpeople",
  "mermaid": "woman_merpeople",
  "elf": "person_elf",
  "genie": "person_genie",
  "zombie": "person_zombie",
  "people_with_bunny_ears": "person_with_bunny_ears",
  "men_with_bunny_ears": "man_with_bunny_ears",
  "women_with_bunny_ears": "woman_with_bunny_ears",
  "people_wrestling": "person_wrestling",
  "men_wrestling": "man_wrestling",
  "women_wrestling": "woman_wrestling",
  "pinata": "piñata",
  "woman_s_clothes": "womans_clothes",
  "man_s_shoe": "mans_shoe",
  "woman_s_sandal": "womans_sandal",
  "woman_s_boot": "womans_boot",
  "woman_s_hat": "womans_hat",
  "rescue_worker_s_helmet": "rescue_workers_helmet",
  "men_s_room": "mens_room",
  "women_s_room": "womens_room",
  "on_arrow": "on!_arrow",
  "keycap_number_sign": "keycap_hastag",
  "a_button": "a_button_blood_type",
  "ab_button": "ab_button_blood_type",
  "b_button": "b_button_blood_type",
  "o_button": "o_button_blood_type",
  "up_button": "up!_button",
  "red_triangle_pointed_up": "red_triangle"
}

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

  // str = replaceString (str, keyMap);
  return str;
}

function replaceString (string, keyMap) {
  // Check if the string is a key in the key map
  if (keyMap.hasOwnProperty (string)) {
    // If yes, return the value from the key map
    return keyMap [string];
  } else {
    // If no, return the original string
    return string;
  }
}

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

  const {groups: {version, emoji, name, desc}} = match
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
    orderedEmoji.push(currentEmoji)
    dataByEmoji[currentEmoji].name = fullName
    dataByEmoji[currentEmoji].slug = slugify(fullName)
    dataByEmoji[currentEmoji].unicode_version = version
    dataByEmoji[currentEmoji].skin_tone_support = false
  }
})

for (const emoji of orderedEmoji) {
  const {group, skin_tone_support, skin_tone_support_unicode_version, name, slug, emoji_version, unicode_version} = dataByEmoji[emoji]
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
//   "😀": {
//     "group": "Smileys & Emotion",
//     "name": "grinning face",
//     "slug": "grinning_face",
//     "version": "6.1",
//     "skin_tone_support": false
//   },
//   ...
// }
fs.writeFileSync('data-by-emoji.json', JSON.stringify(dataByEmoji, null, 2))

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

// [
//   "😀",
//   "😃",
//   ...
// ]
fs.writeFileSync('data-ordered-emoji.json', JSON.stringify(orderedEmoji, null, 2))

// {
//   "light_skin_tone": "🏻",
//   "medium_light_skin_tone": "🏼",
//   ...
// }
fs.writeFileSync('data-emoji-components.json', JSON.stringify(emojiComponents, null, 2))
