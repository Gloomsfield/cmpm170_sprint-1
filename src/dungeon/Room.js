class Room {
    static COMBAT_TYPE = "COMBAT"
    static START_TYPE = "START"
    static REST_TYPE = "REST"
    static BOSS_TYPE = "BOSS"

    static DIR_UP = "UP"

    static maps = {
        map1 : {
            rooms: {
                r1: {
                    type : Room.START_TYPE,
                    connections : {r2: "UP"},
                    options: {}
                },
                r2: {
                    type : Room.COMBAT_TYPE,
                    connections : {},
                    options: {}
                },
            }
        }
    }

    constructor() {
        this.type = Room.START_TYPE
        this.connections = []
    }
}