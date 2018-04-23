const sqlite3 = require('sqlite3').verbose();
const Discord = require("discord.js");
const client = new Discord.Client();
const chatFunctions = require('../modules/chat-functions');

var db = new sqlite3.Database('../../database.db3');

function addParticipantImage(discord_id, img_url) {
    console.log(discord_id, img_url);
    db.run('UPDATE participants SET image_url = ?2 WHERE discord_id = ?1', {
        1: discord_id,
        2: img_url
    });
}

let participants = [
    {
        "id": "261882331738931210",
        "url": "https://cdn.discordapp.com/attachments/424727396684398602/434515363380854795/84375762_8385761324.jpg"
    },
    {
        "id": "207169330549358592",
        "url": "https://cdn.discordapp.com/attachments/424727396684398602/434515528715993088/xmog-contest.jpg"
    },
    {
        "id": "137574919755005952",
        "url": "https://cdn.discordapp.com/attachments/424727396684398602/434539370297688064/66d4561db5b51d32.jpg"
    },
    {
        "id": "221348532794163200",
        "url": "https://cdn.discordapp.com/attachments/424727396684398602/434545699909271552/-3.jpg"
    },
    {
        "id": "230151601493508096",
        "url": "https://cdn.discordapp.com/attachments/424727396684398602/434582244179574786/af3265e7b096af2c.png"
    },
    {
        "id": "186192961241874432",
        "url": "https://cdn.discordapp.com/attachments/424727396684398602/434583142976716801/33c423d0ef84b2f7.png"
    },
    {
        "id": "272284942614921216",
        "url": "https://cdn.discordapp.com/attachments/424727396684398602/434583435118379009/WoWScrnShot_041418_100318.jpg"
    },
    {
        "id": "230747432252735488",
        "url": "https://cdn.discordapp.com/attachments/424727396684398602/434585280528252928/2376.png"
    },
    {
        "id": "208627659511562240",
        "url": "https://cdn.discordapp.com/attachments/424727396684398602/434599105130397696/WoWScrnShot_041418_092018.jpg"
    },
    {
        "id": "208567967263227914",
        "url": "https://cdn.discordapp.com/attachments/424727396684398602/434599539400376338/822a7ae66466ddae.jpg"
    },
    {
        "id": "268832305244667905",
        "url": "https://cdn.discordapp.com/attachments/424727396684398602/434609509252464640/WoWScrnShot_041318_193022.jpg"
    },
    {
        "id": "236571356823683073",
        "url": "https://cdn.discordapp.com/attachments/424727396684398602/434639788281298945/2WoWScrnShot_040818_203505.png"
    },
    {
        "id": "245197225943236619",
        "url": "https://cdn.discordapp.com/attachments/424727396684398602/434692544908099594/WoWScrnShot_041318_201702.jpg"
    },
    {
        "id": "360301710335541251",
        "url": "https://cdn.discordapp.com/attachments/424727396684398602/434799532899958787/unknown.png"
    },
    {
        "id": "247035457236369408",
        "url": "https://cdn.discordapp.com/attachments/424727396684398602/434827929298665483/image.jpg"
    },
    {
        "id": "233305136078782464",
        "url": "https://cdn.discordapp.com/attachments/424727396684398602/434896224605175820/1.jpg"
    },
    {
        "id": "249659402297016323",
        "url": "https://cdn.discordapp.com/attachments/424727396684398602/435134605658554378/MyCollages.jpg"
    },
    {
        "id": "289141392981229569",
        "url": "https://cdn.discordapp.com/attachments/424727396684398602/435151551829377048/123.png"
    },
    {
        "id": "169446790997737472",
        "url": "https://cdn.discordapp.com/attachments/424727396684398602/435216131645636628/1235.jpg"
    },
    {
        "id": "235368876689457154",
        "url": "https://cdn.discordapp.com/attachments/424727396684398602/435377275928707072/WoWScrnShot_041618_185140.jpg"
    },
    {
        "id": "275738741400797184",
        "url": "https://cdn.discordapp.com/attachments/424727396684398602/435524467201146891/Transmog.jpg"
    },
    {
        "id": "174945441882963968",
        "url": "https://cdn.discordapp.com/attachments/424727396684398602/435564039607812096/qwerty.jpg"
    },
    {
        "id": "245952705397391360",
        "url": "https://cdn.discordapp.com/attachments/424727396684398602/435671389161390090/WoWScrnShot_041718_121816.jpg"
    },
    {
        "id": "209029118141005824",
        "url": "https://cdn.discordapp.com/attachments/424727396684398602/435918586771669002/PIKNIK.png"
    },
    {
        "id": "211098413855539201",
        "url": "https://cdn.discordapp.com/attachments/424727396684398602/436166458033307648/1f1a40affce904f0.jpg"
    },
    {
        "id": "221578752814088193",
        "url": "https://cdn.discordapp.com/attachments/424727396684398602/436478917927501824/unknown-1-1.png"
    },
    {
        "id": "282944429847740417",
        "url": "https://cdn.discordapp.com/attachments/424727396684398602/436613231021391875/1922059810587b07.png"
    },
    {
        "id": "157707571577356288",
        "url": "https://cdn.discordapp.com/attachments/424727396684398602/436617136035725313/WoWScrnShot_042018_024314.jpg"
    },
    {
        "id": "209604422131515403",
        "url": "https://cdn.discordapp.com/attachments/424727396684398602/436649771483136010/xmog-contest.png"
    },
    {
        "id": "217267966314676224",
        "url": "https://cdn.discordapp.com/attachments/424721208676974592/434525912055283742/148599362-main_1.jpg"
    },
    {
        "id": "229173015408017409",
        "url": "https://cdn.discordapp.com/attachments/424721208676974592/434539582361436160/WoWScrnShot_032318_114746.jpg"
    },
    {
        "id": "288368634932232192",
        "url": "https://cdn.discordapp.com/attachments/424721208676974592/434623861850636289/N_Ashen.jpg"
    },
    {
        "id": "215435832893374466",
        "url": "https://cdn.discordapp.com/attachments/424721208676974592/434651752298709002/WoWScrnShot_041418_144024.jpg"
    },
    {
        "id": "300581911166844929",
        "url": "https://cdn.discordapp.com/attachments/424721208676974592/434744050881396747/unknown.png"
    },
    {
        "id": "202435421555261441",
        "url": "https://cdn.discordapp.com/attachments/424721208676974592/435104541667491851/WoWScrnShot_041518_203556.jpg"
    },
    {
        "id": "222482184533966848",
        "url": "https://cdn.discordapp.com/attachments/424721208676974592/436264175476408321/WoWScrnShot_041818_233408.jpg"
    },
    {
        "id": "299119622039273473",
        "url": "https://cdn.discordapp.com/attachments/424721208676974592/436449382540247040/WoWScrnShot_032018_002412.png"
    },
    {
        "id": "219363563461017600",
        "url": "https://cdn.discordapp.com/attachments/431950246868680735/434519807354732544/WoWScrnShot_041318_201212.jpg"
    },
    {
        "id": "219749634577399809",
        "url": "https://cdn.discordapp.com/attachments/431950246868680735/434554284688801792/WoWScrnShot_040918_135725.jpg"
    },
    {
        "id": "236753929348579328",
        "url": "https://cdn.discordapp.com/attachments/431950246868680735/434559478508290048/X-MOG_Noveske.jpg"
    },
    {
        "id": "203884537825067008",
        "url": "https://cdn.discordapp.com/attachments/431950246868680735/434663210608754688/WoWScrnShot_041318_210844.jpg"
    },
    {
        "id": "228917186620555265",
        "url": "https://cdn.discordapp.com/attachments/431950246868680735/434820062680186880/unknown.png"
    },
    {
        "id": "208512819266584576",
        "url": "https://cdn.discordapp.com/attachments/431950246868680735/435404690918998028/unknown.png"
    },
    {
        "id": "117753453328990216",
        "url": "https://cdn.discordapp.com/attachments/432486442858446848/434636417499529226/Untitled.png"
    },
    {
        "id": "217350581633679360",
        "url": "https://cdn.discordapp.com/attachments/432486442858446848/434653718537961473/1.jpg"
    },
    {
        "id": "211007313476059136",
        "url": "https://cdn.discordapp.com/attachments/432486442858446848/434738911453904906/b8fcf532f6600c66.jpg"
    },
    {
        "id": "326970605649788928",
        "url": "https://cdn.discordapp.com/attachments/432486442858446848/435841872829874176/WoWScrnShot_041718_203554.jpg"
    },
    // {
    //     "id": "999999999999999999",
    //     "url": "https://cdn.discordapp.com/attachments/432486442858446848/436495486334140417/81bf22bb141910e3.jpg"
    // },
    {
        "id": "125909896985182208",
        "url": "https://cdn.discordapp.com/attachments/425328769792999434/434516471343874048/1.png"
    },
    {
        "id": "213326376466382849",
        "url": "https://cdn.discordapp.com/attachments/425328769792999434/434557905581375498/WoWScrnShot_041418_011826.jpg"
    },
    {
        "id": "204795476606713857",
        "url": "https://cdn.discordapp.com/attachments/425328769792999434/434565851287388160/WoWScrnShot_040918_102845.jpg"
    },
    {
        "id": "213394823107969028",
        "url": "https://cdn.discordapp.com/attachments/425328769792999434/434566824672100372/unknown.png"
    },
    {
        "id": "216330864924033025",
        "url": "https://cdn.discordapp.com/attachments/425328769792999434/434618240975765524/999.png"
    },
    {
        "id": "195622041095897088",
        "url": "https://cdn.discordapp.com/attachments/425328769792999434/434625223695007745/2.jpg"
    },
    {
        "id": "220413330953601024",
        "url": "https://cdn.discordapp.com/attachments/425328769792999434/434628119014539295/70.png"
    },
    {
        "id": "247690621467361281",
        "url": "https://cdn.discordapp.com/attachments/425328769792999434/434628204783730689/Screenshot_36.png"
    },
    {
        "id": "158154593342062592",
        "url": "https://cdn.discordapp.com/attachments/425328769792999434/434633087465422849/-.jpg"
    },
    {
        "id": "158715861362802689",
        "url": "https://cdn.discordapp.com/attachments/425328769792999434/434639902982799360/d4cd846cde8f722e.jpg"
    },
    {
        "id": "239082706141577216",
        "url": "https://cdn.discordapp.com/attachments/425328769792999434/434642417853923328/WoWScrnShot_041318_234430.jpg"
    },
    {
        "id": "219738602098262016",
        "url": "https://cdn.discordapp.com/attachments/425328769792999434/434674538937188353/WoWScrnShot_041318_194316.jpg"
    },
    {
        "id": "286950743213211651",
        "url": "https://cdn.discordapp.com/attachments/425328769792999434/434722622383587334/-.jpg"
    },
    {
        "id": "276372970824531968",
        "url": "https://cdn.discordapp.com/attachments/425328769792999434/434722871722639360/72cdbce4d5245096.jpg"
    },
    {
        "id": "246205272765235211",
        "url": "https://cdn.discordapp.com/attachments/425328769792999434/434744501081473039/WoWScrnShot_070417_151712_copy.jpg"
    },
    {
        "id": "298473590678880256",
        "url": "https://cdn.discordapp.com/attachments/425328769792999434/434760279641948160/WoWScrnShot_041418_195632.jpg"
    },
    {
        "id": "252497523569065994",
        "url": "https://cdn.discordapp.com/attachments/425328769792999434/434795852847120384/unknown.png"
    },
    {
        "id": "207970582623551488",
        "url": "https://cdn.discordapp.com/attachments/425328769792999434/435017098318839821/WoWScrnShot_041518_125953.jpg"
    },
    {
        "id": "166613427391823872",
        "url": "https://cdn.discordapp.com/attachments/425328769792999434/435502755986145281/6a0090752d313573.jpg"
    },
    {
        "id": "233634100571930635",
        "url": "https://cdn.discordapp.com/attachments/425328769792999434/435502761296134165/line12.PNG"
    },
    {
        "id": "166073932821168128",
        "url": "https://cdn.discordapp.com/attachments/425328769792999434/435828508359393300/Djinho-contest.png"
    },
    {
        "id": "223854135609524224",
        "url": "https://cdn.discordapp.com/attachments/425328769792999434/436629168965287954/123.png"
    },
    {
        "id": "197414087380959232",
        "url": "https://cdn.discordapp.com/attachments/425328769792999434/436815227124842496/WoWScrnShot_042018_120419.jpg"
    },
    {
        "id": "218856977424580609",
        "url": "https://cdn.discordapp.com/attachments/425328769792999434/437734628640423946/WoWScrnShot_042318_004919.jpg"
    },
    {
        "id": "324101116629483521",
        "url": "https://cdn.discordapp.com/attachments/425328769792999434/438005874598871040/unknown.png"
    },
    {
        "id": "202388345509117952",
        "url": "https://cdn.discordapp.com/attachments/433280762419085312/434549239620698112/nbtrans_Fotor2.png"
    },
    {
        "id": "231055163543126016",
        "url": "https://cdn.discordapp.com/attachments/433280762419085312/434569054653644810/WoWScrnShot_041318_194331.jpg"
    },
    {
        "id": "172381182070095873",
        "url": "https://cdn.discordapp.com/attachments/433280762419085312/434576937931767818/4123123.png"
    },
    {
        "id": "215431956555497472",
        "url": "https://cdn.discordapp.com/attachments/433280762419085312/434607466270162944/WoWScrnShot_091417_002855.jpg"
    },
    {
        "id": "280409684857323520",
        "url": "https://cdn.discordapp.com/attachments/433280762419085312/434616517859213313/WoWScrnShot_041318_201920.jpg"
    },
    {
        "id": "142010323099058176",
        "url": "https://cdn.discordapp.com/attachments/433280762419085312/434665338161070080/2017-05-17_04.17.52.png"
    },
    {
        "id": "115158165695365126",
        "url": "https://cdn.discordapp.com/attachments/433280762419085312/434665582240202752/3.png"
    },
    {
        "id": "158248066179268609",
        "url": "https://cdn.discordapp.com/attachments/433280762419085312/434671754707861504/aa7d915048.png"
    },
    {
        "id": "242719999456837632",
        "url": "https://cdn.discordapp.com/attachments/433280762419085312/434698636253724672/0dd816f3f45a9f4a.png"
    },
    {
        "id": "219803121755357184",
        "url": "https://cdn.discordapp.com/attachments/433280762419085312/435035992576098304/WoWScrnShot_031018_155122.jpg"
    },
    {
        "id": "145634664638447616",
        "url": "https://cdn.discordapp.com/attachments/432487013074206720/434583082406903808/unknown.png"
    },
    {
        "id": "217356150083944448",
        "url": "https://cdn.discordapp.com/attachments/432487013074206720/434585549819346954/WoWScrnShot_041318_214346.jpg"
    },
    {
        "id": "178603419274051584",
        "url": "https://cdn.discordapp.com/attachments/432487013074206720/434815235434741760/MyCollages.png"
    },
    {
        "id": "218321398538567680",
        "url": "https://cdn.discordapp.com/attachments/432487013074206720/435007088427532288/ec5deb0ab1cdaa0d.png"
    },
    {
        "id": "208600068167696384",
        "url": "https://cdn.discordapp.com/attachments/432487013074206720/435533860663459850/MyCollages_2.jpg"
    },
    {
        "id": "219754612528381952",
        "url": "https://cdn.discordapp.com/attachments/432137285769625611/434613446768853025/WoWScrnShot_041418_101739.jpg"
    },
    {
        "id": "219535817406808065",
        "url": "https://cdn.discordapp.com/attachments/432137285769625611/434652909284622336/1.jpg"
    },
    {
        "id": "251310889913810945",
        "url": "https://cdn.discordapp.com/attachments/432137285769625611/434713195526094858/unknown.png"
    },
    {
        "id": "288017906338627594",
        "url": "https://cdn.discordapp.com/attachments/432137285769625611/434947565646118932/xmog_ultra.png"
    },
    {
        "id": "210259621330419713",
        "url": "https://cdn.discordapp.com/attachments/432137285769625611/435071773168500737/WoWScrnShot_041518_161932.jpg"
    },
    {
        "id": "223883536476798978",
        "url": "https://cdn.discordapp.com/attachments/432137285769625611/435182399756828672/0054a09874573572.png"
    },
    {
        "id": "210827956438827008",
        "url": "https://cdn.discordapp.com/attachments/432137285769625611/436669785997312010/ecstacy.jpg"
    },
    {
        "id": "217283181018218496",
        "url": "https://cdn.discordapp.com/attachments/424724588715311105/434517607996063745/5ccd0bcaeb2a1df0.jpg"
    },
    {
        "id": "228492432424042497",
        "url": "https://cdn.discordapp.com/attachments/424724588715311105/434523178383966218/unknown.png"
    },
    {
        "id": "198923317124530177",
        "url": "https://cdn.discordapp.com/attachments/424724588715311105/436623022653440001/WoWScrnShot_041918_230306.jpg"
    },
    // {
    //     "id": "888888888888888888",
    //     "url": "https://cdn.discordapp.com/attachments/432137285769625611/434652909284622336/1.jpg"
    // },
    {
        "id": "263686680060362753",
        "url": "https://cdn.discordapp.com/attachments/432547896026464266/436926297193709572/MyCollages.jpg"
    },
    {
        "id": "350341906729009154",
        "url": "https://cdn.discordapp.com/attachments/432133368084430849/434516515895640075/WoWScrnShot_041018_115104.jpg"
    },
    {
        "id": "196222704586588172",
        "url": "https://cdn.discordapp.com/attachments/432133368084430849/434584600333910037/WoWScrnShot_041318_204623.jpg"
    },
    {
        "id": "264081682636734465",
        "url": "https://cdn.discordapp.com/attachments/432133368084430849/434645475199680522/2018-04-14_12-24-52.png"
    },
    {
        "id": "239849677158219776",
        "url": "https://cdn.discordapp.com/attachments/432133368084430849/434722315436294144/2435546.jpg"
    },
    {
        "id": "198965429513879552",
        "url": "https://cdn.discordapp.com/attachments/432133368084430849/434841525944451082/unknown.png"
    },
    {
        "id": "360301710335541251",
        "url": "https://cdn.discordapp.com/attachments/424727396684398602/434799532899958787/unknown.png"
    },
    {
        "id": "187238249436151838",
        "url": "https://cdn.discordapp.com/attachments/432137285769625611/434514550826467338/WoWScrnShot_041318_152250.jpg"
    },
    {
        "id": "151903525536792577",
        "url": "https://cdn.discordapp.com/attachments/433280762419085312/434608995940958218/unknown.png"
    },
    {
        "id": "212541475928408064",
        "url": "https://cdn.discordapp.com/attachments/424724588715311105/434649588402749440/02c1fa51c4.png"
    },
    {
        "id": "219884753988354049",
        "url": "https://cdn.discordapp.com/attachments/424721208676974592/434608060628205588/WoWScrnShot_041018_225022.jpg"
    }
];

participants.forEach((p) => {
   addParticipantImage(p.id, p.url);
});

db.run('UPDATE participants SET image_url = ?2 WHERE id = ?1', {
    1: 112,
    2: "https://cdn.discordapp.com/attachments/432137285769625611/434652909284622336/1.jpg"
});
db.run('UPDATE participants SET image_url = ?2 WHERE id = ?1', {
    1: 103,
    2: "https://cdn.discordapp.com/attachments/432486442858446848/436495486334140417/81bf22bb141910e3.jpg"
});

