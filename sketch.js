'use strict';

let pattern = [];
let pattern_ans_list = [];
let ans_no;
let pattern_ans;

let pattern_no = 541;
let pattern_num = { 1:2, 3:4, 21:3, 23:1,};

let cell_color_no = [];
let cell_num = [];
let cell_small_num = [];


let GAP_Y = 5;
let STAGE_X = 5;
let STAGE_Y = GAP_Y;
let YOKO = 5;
let TATE = 5;
let SIZE = 50;

const color_palette = [
    'pink',
    'red', 'orange', 'purple', 'green', 'skyblue',
    //'limegreen', 'gray', 'blue', 'greenyellow',
    //'white', 'black',
];

const PALETTE_KAZU = color_palette.length;
let PALETTE_X = STAGE_X + YOKO * SIZE + GAP_Y;
let PALETTE_Y = STAGE_Y;
let PALETTE_YOKO = 1;
let PALETTE_TATE = color_palette.length;
let PALETTE_SIZE = SIZE;

let NUM_X = STAGE_X;
let NUM_Y = STAGE_Y + SIZE * 5 + GAP_Y;
let NUM_SIZE = Math.floor(SIZE * YOKO / 5);

let SMALL_NUM_X = STAGE_X;
let SMALL_NUM_Y = NUM_Y + NUM_SIZE + GAP_Y;
let SMALL_NUM_SIZE = NUM_SIZE;

let COMMAND_X = STAGE_X;
let COMMAND_Y = SMALL_NUM_Y + NUM_SIZE + GAP_Y;
let COMMAND_SIZE = NUM_SIZE;
let COMMAND_KAZU = 3;

let TEXT_SIZE = 32;
let SMALL_TEXT_SIZE = 12;

let selected_cells = [];
let edit_mode = false;

//----------------------------------------
function setup() {
    //createCanvas(320, 480);
    createCanvas(windowWidth, windowHeight);

    let width = windowWidth;
    let heigt = windowHeight;
    SIZE = min(100, min(Math.floor(width / (YOKO + PALETTE_YOKO + 0.5)), Math.floor(height / (TATE + 3 + 1))));
    TEXT_SIZE = Math.floor(32 * SIZE / 50);
    SMALL_TEXT_SIZE = Math.floor(TEXT_SIZE / 3);

    PALETTE_SIZE = SIZE;
    PALETTE_X = STAGE_X + YOKO * SIZE + GAP_Y;
    PALETTE_Y = STAGE_Y;

    NUM_SIZE = SIZE;
    NUM_X = STAGE_X;
    NUM_Y = STAGE_Y + SIZE * TATE + GAP_Y;

    SMALL_NUM_SIZE = SIZE;
    SMALL_NUM_X = STAGE_X;
    SMALL_NUM_Y = NUM_Y + NUM_SIZE + GAP_Y;

    COMMAND_SIZE = SIZE;
    COMMAND_X = STAGE_X;
    COMMAND_Y = SMALL_NUM_Y + NUM_SIZE + GAP_Y;

    build_pattern(pattern_no);
    for (const k in pattern_num) {
        cell_num[k] = pattern_num[k];
    }
    edit_mode = false;
}

function draw() {
    if (edit_mode) {
        background('skyblue');
    } else {
        background('pink');
    }

    for (let i = 0; i < 25; i++) {
        let x = STAGE_X + (i % 5) * SIZE;
        let y = STAGE_Y + Math.floor(i / 5) * SIZE;
        let color_no = cell_color_no[i] || 0;
        let num = cell_num[i];
        let small_num = cell_small_num[i];
        
        fill(color_palette[color_no]);
        stroke(128);
        strokeWeight(1);
        rect(x, y, SIZE);

        if (edit_mode) {
            stroke('midnightblue');
            fill('midnightblue');
            strokeWeight(1);
            textSize(TEXT_SIZE);
            textAlign(CENTER, CENTER);
            text(pattern_ans[i], x + SIZE / 2, y + SIZE / 2);
        } else if (1 <= num && num <= 5) {
            if (i in pattern_num) {
                stroke('midnightblue');
                fill('midnightblue');
            } else {
                stroke(0);
                fill(0);
            }
            strokeWeight(1);
            textSize(TEXT_SIZE);
            textAlign(CENTER, CENTER);
            text(num, x + SIZE / 2, y + SIZE / 2);
        } else if (small_num && small_num.length > 0) {
            strokeWeight(1);
            textSize(SMALL_TEXT_SIZE);
            textAlign(CENTER, CENTER);
            for (let num of small_num) {
                const moji_gap = Math.floor(8 * SMALL_TEXT_SIZE / 12);
                stroke(0)
                fill(0);
                text(num, x + NUM_SIZE / 2 + (num - 3) * moji_gap, y + NUM_SIZE / 2);
            }
        }
    }

    //----------
    stroke(0);
    strokeWeight(3);
    for (let i = 0; i < 25; i++) {
        let x = STAGE_X + (i % 5) * SIZE;
        let y = STAGE_Y + Math.floor(i / 5) * SIZE;

        let block = [];
        for (let b of pattern) {
            if (b.includes(i)) {
                block = b;
                break;
            }
        }
        if (i % 5 != 4 && !block.includes(i + 1)) {
            line(x+SIZE, y, x+SIZE, y+SIZE);
        }
        if (i < 20 && !block.includes(i + 5)) {
            line(x, y+SIZE, x+SIZE, y+SIZE);
        }
    }
    stroke(0);
    strokeWeight(3);
    noFill();
    rect(STAGE_X, STAGE_Y, SIZE * 5);

    for (const cell of selected_cells) {
        let x = STAGE_X + (cell % YOKO) * SIZE;
        let y = STAGE_Y + Math.floor(cell / YOKO) * SIZE;
        stroke('darkorange');
        strokeWeight(5);
        noFill();
        rect(x + 3, y + 3, SIZE - 6);
    }

    //----------
    for (let i = 0; i < color_palette.length; i++) {
        let x = PALETTE_X + (i % PALETTE_YOKO) * PALETTE_SIZE;
        let y = PALETTE_Y + Math.floor(i / PALETTE_YOKO) * PALETTE_SIZE;
        stroke(0);
        strokeWeight(3);
        fill(color_palette[i]);
        rect(x, y, PALETTE_SIZE);
    }

    //----------
    for (let i = 0; i < 5; i++) {
        let x = NUM_X + i * NUM_SIZE;
        let y = NUM_Y;
        stroke(0);
        strokeWeight(3);
        noFill();
        rect(x, y, NUM_SIZE);

        let moji = `${i + 1}`;
        strokeWeight(1);
        fill(0);
        textSize(TEXT_SIZE);
        textAlign(CENTER, CENTER);
        if (edit_mode) {
            textSize(20);
            switch (i) {
            case 0:
                moji = '-100';
                break;
            case 1:
                moji = '-10';
                break;
            case 2:
                moji = `${pattern_no + 1}`;
                break;
            case 3:
                moji = '+10';
                break;
            case 4:
                moji = '+100';
                break;
            }
        }
        text(moji, x + NUM_SIZE / 2, y + NUM_SIZE / 2);
    }

    //----------
    for (let i = 0; i < 5; i++) {
        let x = SMALL_NUM_X + i * NUM_SIZE;
        let y = SMALL_NUM_Y;
        const moji_gap = Math.floor(8 * SMALL_TEXT_SIZE / 12);
    
        stroke(0);
        strokeWeight(3);
        noFill();
        rect(x, y, NUM_SIZE);

        strokeWeight(1);
        textSize(SMALL_TEXT_SIZE);
        textAlign(CENTER, CENTER);
        stroke(180);
        fill(180);
        for (let j = 0; j < 5; j++) {
            if (j == i) continue;
            text(j + 1, x + NUM_SIZE / 2 + (j - 2) * moji_gap, y + NUM_SIZE / 2);
        }
        stroke(0)
        fill(0);
        text(i + 1, x + NUM_SIZE / 2 + (i - 2) * moji_gap, y + NUM_SIZE / 2);
    }

    //----------
    for (let i = 0; i < COMMAND_KAZU; i++) {
        let x = COMMAND_X + i * COMMAND_SIZE;
        let y = COMMAND_Y;
    
        stroke(0);
        strokeWeight(3);
        noFill();
        rect(x, y, COMMAND_SIZE);
        if (i == 0) {
            if (edit_mode) {
                strokeWeight(1);
                textSize(24)
                stroke(0);
                fill(0);
                text(ans_no + 1, x + COMMAND_SIZE / 2, y + COMMAND_SIZE / 2)
            } else {
                stroke(0);
                strokeWeight(3);
                line(x, y, x + COMMAND_SIZE, y + COMMAND_SIZE);
                line(x + COMMAND_SIZE, y, x, y + COMMAND_SIZE);
            }
        } else if (i == 1) {
            strokeWeight(1);
            textSize(24)
            stroke(0);
            fill(0);
            text('CLS', x + COMMAND_SIZE / 2, y + COMMAND_SIZE / 2)
        } else if (i == 2) {
            strokeWeight(1);
            textSize(20);
            stroke(0);
            fill(0);
            text('EDIT', x + COMMAND_SIZE / 2, y + COMMAND_SIZE / 2)
        }
    }

    strokeWeight(1);
    stroke(0);
    fill(0);
    textSize(20);
    textAlign(LEFT, TOP)
    text(pattern_no + 1, PALETTE_X, PALETTE_Y + PALETTE_SIZE * PALETTE_KAZU + GAP_Y);
}

function mousePressed() {
    let yoko = Math.floor((mouseX - STAGE_X) / SIZE);
    let tate = Math.floor((mouseY - STAGE_Y) / SIZE);

    let palette_yoko = Math.floor((mouseX - PALETTE_X) / PALETTE_SIZE);
    let palette_tate = Math.floor((mouseY - PALETTE_Y) / PALETTE_SIZE);

    let num = -1;
    let small_num = -1;
    let cell_no = -1;
    let palette_no = -1;
    let command_no = -1;
    let unselected = false;
    if (0 <= yoko && yoko < YOKO && 0 <= tate && tate < TATE) {
        cell_no = yoko + tate * YOKO;
    } else if (0 <= palette_yoko && palette_yoko < PALETTE_YOKO && 0 <= palette_tate && palette_tate < PALETTE_TATE) {
        palette_no = palette_yoko + palette_tate * PALETTE_YOKO;
    } else if (NUM_X < mouseX && mouseX < NUM_X + NUM_SIZE * 5 && NUM_Y < mouseY && mouseY < NUM_Y + NUM_SIZE) {
        num = Math.floor((mouseX - NUM_X) / NUM_SIZE) + 1;
    } else if (SMALL_NUM_X < mouseX && mouseX < SMALL_NUM_X + NUM_SIZE * 5 && SMALL_NUM_Y < mouseY && mouseY < SMALL_NUM_Y + NUM_SIZE) {
        small_num = Math.floor((mouseX - NUM_X) / NUM_SIZE) + 1;
    } else if (COMMAND_X < mouseX && mouseX < COMMAND_X + COMMAND_SIZE * COMMAND_KAZU && COMMAND_Y < mouseY && mouseY < COMMAND_Y + COMMAND_SIZE) {
        command_no = Math.floor((mouseX - COMMAND_X) / COMMAND_SIZE);
    } else {
        unselected = true;
    }

    if (0 <= cell_no) {
        let idx = selected_cells.indexOf(cell_no);
        if (idx >= 0) {
            selected_cells.splice(idx, 1);
        } else {
            selected_cells.push(cell_no);
            //selected_cells = [cell_no];
        }
    } else if (0 <= palette_no && palette_no < PALETTE_KAZU) {
        for (const cell of selected_cells) {
            cell_color_no[cell] = palette_no;
        }
    } else if (1 <= num && num <= 5) {
        if (edit_mode) {
            switch (num) {
            case 1:
                pattern_no -= 100;
                break;                
            case 2:
                pattern_no -= 10;
                break;
            case 3:
                pattern_no++;
                break;
            case 4:
                pattern_no += 10;
                break;
            case 5:
                pattern_no += 100;
                break;
            }

            if (pattern_no < 0) {
                pattern_no += pattern_list.length;
            } else if (pattern_no >= pattern_list.length) {
                pattern_no = pattern_no - pattern_list.length;
            }
            build_pattern(pattern_no);
        } else {
            for (const cell of selected_cells) {
                if (!(cell in pattern_num)) {
                    cell_num[cell] = num;
                }
            }
        }
        selected_cells = [];
    } else if (1 <= small_num && small_num <= 5) {
        let delete_flg = false;
        if (selected_cells.length > 0) {
            const cell = selected_cells[selected_cells.length - 1];
            if (cell_small_num[cell] && cell_small_num[cell].includes(small_num)) {
                delete_flg = true;
            }
        }
        for (const cell of selected_cells) {
            if (delete_flg) {
                let idx = cell_small_num[cell].indexOf(small_num);
                if (idx >= 0) {
                    cell_small_num[cell].splice(idx, 1);
                }
            } else {
                if (cell_small_num[cell]) {
                    if (!cell_small_num[cell].includes(small_num)) {
                        cell_small_num[cell].push(small_num);
                    }
                } else {
                    cell_small_num[cell] = [small_num];
                }
            }
        }
    } else if (0 <= command_no) {
        if (command_no == 0) {
            if (edit_mode) {
                ans_no++;
                if (ans_no >= pattern_ans_list.length) {
                    ans_no = 0;
                }
                pattern_ans = pattern_ans_list[ans_no];
            } else {
                for (const cell of selected_cells) {
                    if (!(cell in pattern_num)) {
                        cell_num[cell] = 0;
                        cell_small_num[cell] = [];
                    }
                }
            }
        } else if (command_no == 1) {
            cell_num = [];
            cell_small_num = [];
            cell_color_no = [];
            for (const k in pattern_num) {
                cell_num[k] = pattern_num[k];
            }    
        } else if (command_no == 2) {
            if (edit_mode) {
                edit_mode = false;
                pattern_num = {};
                for (const cell of selected_cells) {
                    pattern_num[cell] = pattern_ans[cell];
                }

                cell_num = [];
                cell_small_num = [];
                cell_color_no = [];
                for (const k in pattern_num) {
                    cell_num[k] = pattern_num[k];
                }

                selected_cells = [];
            } else if (cell_small_num.length == 0 && cell_color_no.length == 0) {
                /*
                const moji = `パターン番号 1-${pattern_list.length}`;
                let result = prompt(moji, pattern_no + 1);
                */
                let result = pattern_no + 1;
                if (result && 1 <= result && result < pattern_list.length + 1) {
                    edit_mode = true;
                    pattern_no = result - 1;
                    build_pattern(pattern_no);
                    selected_cells = [];
                }
            }
        }
    } else if (unselected) {
        selected_cells = [];
    }
}
//-----------------------------------
function build_pattern(pattern_no) {
    pattern = build_pattern_sub(pattern_no);
    pattern_ans_list = build_pattern_ans(pattern);
    if (pattern_ans_list.length == 0) {
        pattern_ans_list.push([0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,]);
    }
    ans_no = pattern_ans_list.length - 1;
    pattern_ans = pattern_ans_list[ans_no];
}

function build_pattern_sub(pattern_no) {
    let new_pattern  = [];
    let fifth_block = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24];
    const block_list = pattern_list[pattern_no];
    for (let i = 0; i < 4; i++) {
        new_pattern[i] = block_pattern_list[i][block_list[i]];
        fifth_block = fifth_block.filter(e => { return !new_pattern[i].includes(e) });
    }
    new_pattern[4] = fifth_block;
    return new_pattern;
}

function build_pattern_ans(new_pattern) {
    let ans_list = [];
    for (const ans of latin_square_list) {
        let flg = true;
        for (const block of new_pattern) {
            let arr = [];
            for (const e of block) {
                arr.push(ans[e]);
            }
            if (new Set(arr).size != 5) {
                flg = false;
                break;
            }
        }
        if (flg) {
            ans_list.push(ans);
        }
    }

    return ans_list;
}
