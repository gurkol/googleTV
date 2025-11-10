// Vlak - Level Data
// Based on the original game by Miroslav Němeček (1993)

// Tile types:
// ' ' = empty
// '#' = wall
// '.' = goal/target
// '@' = player (Golem)
// '$' = box (blue)
// '*' = box on goal
// '+' = player on goal
// 'B' = box type 2 (green)
// 'Y' = box type 3 (yellow)
// 'R' = box type 4 (red)

const LEVEL_PASSWORDS = [
  'GOLEM', 'KRONE', 'MYDLO', 'LEDEN', 'STROP',
  'LILIE', 'RYBKA', 'KLAUN', 'BRAUN', 'WHITE',
  'MOUSE', 'DREAM', 'IDEAL', 'ILUZE', 'SAINT',
  'BELLS', 'TROJA', 'EMOCE', 'BASTL', 'ISLAM',
  'JEANS', 'METAL', 'MIKRO', 'SENZA', 'GALAX',
  'STONE', 'SLAVE', 'FORTE', 'LUCIE', 'NATUR'
];

const LEVELS = [
  // Level 1 - GOLEM (Tutorial)
  {
    password: 'GOLEM',
    title: 'Level 1 - GOLEM',
    width: 19,
    height: 11,
    data: [
      '    #####          ',
      '    #   #          ',
      '    #$  #          ',
      '  ###  $##         ',
      '  #  $ $ #         ',
      '### # ## #   ######',
      '#   # ## #####  ..#',
      '# $  $          ..#',
      '##### ### #@##  ..#',
      '    #     #########',
      '    #######        '
    ]
  },

  // Level 2 - KRONE
  {
    password: 'KRONE',
    title: 'Level 2 - KRONE',
    width: 15,
    height: 11,
    data: [
      '  ####         ',
      '  #  ###       ',
      '  #$   #       ',
      '###    ###     ',
      '#   ##   #     ',
      '# $  $ ###     ',
      '### $  # #     ',
      '  #  ### #     ',
      '  #.@.   #     ',
      '  #....###     ',
      '  ######       '
    ]
  },

  // Level 3 - MYDLO
  {
    password: 'MYDLO',
    title: 'Level 3 - MYDLO',
    width: 17,
    height: 11,
    data: [
      '       ####      ',
      ' #######  ##     ',
      '##  $ $    #     ',
      '#   # # $  #     ',
      '#  $      ##     ',
      '## # #$  ##      ',
      '## #  # ##       ',
      '##  $ @ #        ',
      '##.....##        ',
      '#......#         ',
      '########         '
    ]
  },

  // Level 4 - LEDEN
  {
    password: 'LEDEN',
    title: 'Level 4 - LEDEN',
    width: 13,
    height: 13,
    data: [
      '  #######    ',
      '  #     #    ',
      '  # $$$ #    ',
      '### # # ##   ',
      '#  $  $ ##   ',
      '#  #@#   #   ',
      '## $ $ $ #   ',
      '### # # ##   ',
      '  # ### #    ',
      '  #.....#    ',
      '  #.....#    ',
      '  #######    ',
      '             '
    ]
  },

  // Level 5 - STROP
  {
    password: 'STROP',
    title: 'Level 5 - STROP',
    width: 15,
    height: 13,
    data: [
      '    ######     ',
      '##### ....#    ',
      '#     ....#    ',
      '#  # $ #  #    ',
      '# $  $ $ ##    ',
      '###$  $ $ #    ',
      '  #  $# # #    ',
      '  ## $  $ #    ',
      '   #   ####    ',
      '   # @ #       ',
      '   #  ##       ',
      '   ####        ',
      '               '
    ]
  },

  // Level 6 - LILIE
  {
    password: 'LILIE',
    title: 'Level 6 - LILIE',
    width: 17,
    height: 11,
    data: [
      '######  ###      ',
      '#..  #  # ####   ',
      '#..  ####    #   ',
      '#..     $ $  #   ',
      '#..  # # $ $ #   ',
      '#..### # $ $ #   ',
      '#### $  $  $ #   ',
      '   #  $ $ $  #   ',
      '   #    #    #   ',
      '   ######  @##   ',
      '          ###    '
    ]
  },

  // Level 7 - RYBKA
  {
    password: 'RYBKA',
    title: 'Level 7 - RYBKA',
    width: 15,
    height: 13,
    data: [
      '       ####    ',
      ' #######  #    ',
      '## $ $ $ $#    ',
      '#  @      #    ',
      '# $ $ $ $ #    ',
      '##       ##    ',
      ' ####  ###     ',
      '    # ##       ',
      '    # #        ',
      '  ###.#        ',
      '  #...#        ',
      '  #...#        ',
      '  #####        '
    ]
  },

  // Level 8 - KLAUN
  {
    password: 'KLAUN',
    title: 'Level 8 - KLAUN',
    width: 13,
    height: 13,
    data: [
      '  #####      ',
      '  #   #      ',
      '  #$  ####   ',
      ' ##  $   #   ',
      ' # $@$   #   ',
      ' #   $ ###   ',
      ' # $  ## #   ',
      ' ##  ## ##   ',
      '  #### # #   ',
      '     #...#   ',
      '     #...#   ',
      '     #####   ',
      '             '
    ]
  },

  // Level 9 - BRAUN
  {
    password: 'BRAUN',
    title: 'Level 9 - BRAUN',
    width: 17,
    height: 11,
    data: [
      '      ####       ',
      '####### @#       ',
      '#     $  #       ',
      '#  $## $ #       ',
      '## #..#  #       ',
      ' # $..# ##       ',
      ' # #..#  #       ',
      ' #  .. $ #       ',
      ' #  #   ##       ',
      ' ##   ###        ',
      '  #####          '
    ]
  },

  // Level 10 - WHITE
  {
    password: 'WHITE',
    title: 'Level 10 - WHITE',
    width: 15,
    height: 13,
    data: [
      '     #####     ',
      '  ####   #     ',
      '### $ $$ #     ',
      '#   #  $ #     ',
      '# @ # #  #     ',
      '#### ## ##     ',
      '#  ....  #     ',
      '# #....  #     ',
      '# #  .  ##     ',
      '#  ######      ',
      '####           ',
      '               ',
      '               '
    ]
  }
];

// Function to get level by index
function getLevel(index) {
  if (index >= 0 && index < LEVELS.length) {
    return LEVELS[index];
  }
  return null;
}

// Function to find level by password
function getLevelByPassword(password) {
  const upperPassword = password.toUpperCase();
  const index = LEVEL_PASSWORDS.indexOf(upperPassword);
  if (index !== -1 && index < LEVELS.length) {
    return { level: LEVELS[index], index: index };
  }
  return null;
}

// Total number of levels
function getTotalLevels() {
  return LEVELS.length;
}
