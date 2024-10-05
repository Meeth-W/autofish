import Config from './config'

let lastCast;
import PogData from '../PogData'

const data = new PogData('autofish', {
    casts: 0
}, 'data.json');

// Custom functions to set yaw and pitch
export const setYaw = (yaw) => Player.getPlayer().field_70177_z = yaw;
export const setPitch = (pitch) => Player.getPlayer().field_70125_A = pitch;

export function chat(message, id = null, hoverElement) {
    if (!id) return new Message(prefix + defaultColor + message.toString().replaceAll("§r", defaultColor)).chat()
    return new Message(message).setChatLineId(id).chat()
}

register('command', () => {
    Config.openGUI();
}).setName('autofish')

const rightClickMethod = Client.getMinecraft().getClass().getDeclaredMethod("func_147121_ag")
rightClickMethod.setAccessible(true)
function rightClick() {
    rightClickMethod.invoke(Client.getMinecraft())
}

const EntityArmorStand = Java.type("net.minecraft.entity.item.EntityArmorStand")
let castCount = 0;
let castsBeforeRotation = Config.randomizeCasts ? Math.floor(Math.random() * 10) + 1 : Config.castsBeforeRotation;

register("soundPlay", () => {
    if (Date.now() - lastCast < 200) return; 
    if (Config.fishman) {
        const holding = Player.getHeldItem();
        if (holding?.getRegistryName() != "minecraft:fishing_rod") return
        const caught = World.getAllEntitiesOfType(EntityArmorStand.class).find(stand => stand.getName().includes("!!!"))
    
        if (caught) {
            ChatLib.clearChat(6969)
            chat(`&8[&6Ghost&8] &7Fishing &8(&5${castCount+1}&8/&5${castsBeforeRotation}&8)&7! &8[${data['casts']+1}]`, 6969)
            rightClick()
            setTimeout(() => {
                rightClick()
                castCount++;
                data['casts'] += 1
                data.save()
                lastCast = Date.now()
                if (castCount >= castsBeforeRotation) {
                    World.playSound('note.harp', '2', '2')
                    setTimeout(() => {
                        rotateHeadRandomly();
                        castCount = 0;
                        castsBeforeRotation = Config.randomizeCasts ? Math.floor(Math.random() * 10) + 1 : Config.castsBeforeRotation;
                    }, 250); // Delay to ensure "fish!" message is sent before head rotation
                }
            }, 250);
        }
    }
}).setCriteria("note.pling")

export const smoothLook = (targetYaw, targetPitch, bonusSteps, done) => {
    const totalSteps = 0 + bonusSteps; // Reduced steps for faster head rotation
    let currentStep = 0;

    if (targetPitch > 90) {
        targetPitch = 90;
    }
    if (targetPitch < -90) {
        targetPitch = -90;
    }

    const smoothLook_ = register('step', () => {
        const curYaw = normalizeYaw(Player.getYaw());
        const curPitch = Player.getPitch();

        const yawDifference = normalizeYaw(targetYaw - curYaw);
        const pitchDifference = targetPitch - curPitch;

        const yawStep = yawDifference / totalSteps;
        const pitchStep = pitchDifference / totalSteps;

        if (currentStep < totalSteps) {
            World.playSound('note.harp', '2', '1')
            snapTo(normalizeYaw(curYaw + yawStep), curPitch + pitchStep)
            currentStep++;
        } else {
            World.playSound('note.harp', '2', '1')
            snapTo(targetYaw, targetPitch)
            if (done) done()
            smoothLook_.unregister();
        }
    });
};

function normalizeYaw(yaw) {
    yaw = yaw % 360;
    if (yaw > 180) {
        yaw -= 360;
    } else if (yaw < -180) {
        yaw += 360;
    }
    return yaw;
}

export function snapTo(yaw, pitch) {
    const player = Player.getPlayer();

    player.field_70177_z = yaw
    player.field_70125_A = pitch;
}

function rotateHeadRandomly() {
    const currentPitch = Player.getPlayer().field_70125_A;
    const currentYaw = Player.getPlayer().field_70177_z;
    const pitchMovement = Config.pitchMovement;
    const yawMovement = Config.yawMovement;
    const newPitch = currentPitch + (Math.random() < 0.5 ? pitchMovement : -pitchMovement);
    const newYaw = currentYaw + (Math.random() < 0.5 ? yawMovement : -yawMovement);
    smoothLook(newYaw, newPitch, 5, () => {
        World.playSound('note.harp', '2', '2');
    })
}

chat(`&8[&6Ghost&8] &7Fishing Macro Loaded!`, 6969)

