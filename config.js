import { @Vigilant, @TextProperty, @ColorProperty, @ButtonProperty, @SwitchProperty, Color, @SelectorProperty, @SliderProperty } from '../Vigilance';


@Vigilant('autofish', '&6Auto Fish', {
    getCategoryComparator: () => (a, b) => {
        const categories = ['Fishing'];
        return 1;
    }
})
class Config {
    @SwitchProperty({
        name: 'Auto-Fish',
        category: 'Fishing',
        subcategory: 'Main Toggle'
    })
    fishman = false;

    @SliderProperty({
        name: 'Casts Before Rotation',
        description: 'Number of casts before rotating the head',
        category: 'Fishing',
        subcategory: 'Rotation Settings',
        min: 1,
        max: 10
    })
    castsBeforeRotation = 5;

    @SwitchProperty({
        name: 'Randomize Casts',
        description: 'Randomize the number of casts before rotation',
        category: 'Fishing',
        subcategory: 'Rotation Settings'
    })
    randomizeCasts = false;

    @SliderProperty({
        name: 'Pitch Movement',
        description: 'Degrees to move the pitch (head rotation)',
        category: 'Fishing',
        subcategory: 'Rotation Settings',
        min: 1,
        max: 10
    })
    pitchMovement = 5;

    @SliderProperty({
        name: 'Yaw Movement',
        description: 'Degrees to move the yaw',
        category: 'Fishing',
        subcategory: 'Rotation Settings',
        min: 1,
        max: 10
    })
    yawMovement = 5;

    constructor() {
        this.initialize(this);
    }
}
export default new Config();
