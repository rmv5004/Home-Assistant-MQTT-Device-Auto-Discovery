const readline = require('readline');
const crypto = require('crypto');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Device Types and their corresponding options
const deviceType = {
    1: "Binary Sensor",
    2: "Button",
    3: "Cover",
    4: "Event",
    5: "Humidifier",
    6: "Media player",
    7: "Number",
    8: "Sensor",
    9: "Switch",
    10: "Update",
    11: "Valve"
};

// Sensor types and their corresponding units
const sensorClasses = {
    "apparent_power": ["VA"],
    "aqi": ["unitless"],
    "area": ["m²", "cm²", "km²", "mm²", "in²", "ft²", "yd²", "mi²", "ac", "ha"],
    "atmospheric_pressure": ["cbar", "bar", "hPa", "mmHg", "inHg", "kPa", "mbar", "Pa", "psi"],
    "battery": ["%"],
    "blood_glucose_concentration": ["mg/dL", "mmol/L"],
    "carbon_dioxide": ["ppm"],
    "carbon_monoxide": ["ppm"],
    "current": ["A", "mA"],
    "data_rate": ["bit/s", "kbit/s", "Mbit/s", "Gbit/s", "B/s", "kB/s", "MB/s", "GB/s", "KiB/s", "MiB/s", "GiB/s"],
    "data_size": ["bit", "kbit", "Mbit", "Gbit", "B", "kB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB", "KiB", "MiB", "GiB", "TiB", "PiB", "EiB", "ZiB", "YiB"],
    "date": ["ISO 8601"],
    "distance": ["km", "m", "cm", "mm", "mi", "nmi", "yd", "in"],
    "duration": ["d", "h", "min", "s", "ms"],
    "energy": ["J", "kJ", "MJ", "GJ", "mWh", "Wh", "kWh", "MWh", "GWh", "TWh", "cal", "kcal", "Mcal", "Gcal"],
    "energy_storage": ["J", "kJ", "MJ", "GJ", "mWh", "Wh", "kWh", "MWh", "GWh", "TWh", "cal", "kcal", "Mcal", "Gcal"],
    "enum": ["non-numeric states"],
    "frequency": ["Hz", "kHz", "MHz", "GHz"],
    "gas": ["m³", "ft³", "CCF"],
    "humidity": ["%"],
    "illuminance": ["lx"],
    "irradiance": ["W/m²", "BTU/(h⋅ft²)"],
    "moisture": ["%"],
    "monetary": ["ISO 4217"],
    "nitrogen_dioxide": ["µg/m³"],
    "nitrogen_monoxide": ["µg/m³"],
    "nitrous_oxide": ["µg/m³"],
    "ozone": ["µg/m³"],
    "ph": ["pH"],
    "pm1": ["µg/m³"],
    "pm25": ["µg/m³"],
    "pm10": ["µg/m³"],
    "power_factor": ["unitless", "%"],
    "power": ["mW", "W", "kW", "MW", "GW", "TW"],
    "precipitation": ["cm", "in", "mm"],
    "precipitation_intensity": ["in/d", "in/h", "mm/d", "mm/h"],
    "pressure": ["Pa", "kPa", "hPa", "bar", "cbar", "mbar", "mmHg", "inHg", "psi"],
    "reactive_power": ["var"],
    "signal_strength": ["dB", "dBm"],
    "sound_pressure": ["dB", "dBA"],
    "speed": ["ft/s", "in/d", "in/h", "in/s", "km/h", "kn", "m/s", "mph", "mm/d", "mm/s"],
    "sulphur_dioxide": ["µg/m³"],
    "temperature": ["°C", "°F", "K"],
    "timestamp": ["ISO 8601"],
    "volatile_organic_compounds": ["µg/m³"],
    "volatile_organic_compounds_parts": ["ppm", "ppb"],
    "voltage": ["V", "mV", "µV"],
    "volume": ["L", "mL", "gal", "fl. oz.", "m³", "ft³", "CCF"],
    "volume_flow_rate": ["m³/h", "ft³/min", "L/min", "gal/min", "mL/s"],
    "volume_storage": ["L", "mL", "gal", "fl. oz.", "m³", "ft³", "CCF"],
    "water": ["L", "gal", "m³", "ft³", "CCF"],
    "weight": ["kg", "g", "mg", "µg", "oz", "lb", "st"],
    "wind_speed": ["Beaufort", "ft/s", "km/h", "kn", "m/s", "mph"]
};

const binarySensorClasses = {
    "none": ["on_off"],
    "battery": ["on_off"],
    "battery_charging": ["on_off"],
    "carbon_monoxide": ["on_off"],
    "cold": ["on_off"],
    "connectivity": ["on_off"],
    "door": ["on_off"],
    "garage_door": ["on_off"],
    "gas": ["on_off"],
    "heat": ["on_off"],
    "light": ["on_off"],
    "lock": ["on_off"],
    "moisture": ["on_off"],
    "motion": ["on_off"],
    "moving": ["on_off"],
    "occupancy": ["on_off"],
    "opening": ["on_off"],
    "plug": ["on_off"],
    "power": ["on_off"],
    "presence": ["on_off"],
    "problem": ["on_off"],
    "running": ["on_off"],
    "safety": ["on_off"],
    "smoke": ["on_off"],
    "sound": ["on_off"],
    "tamper": ["on_off"],
    "update": ["on_off"],
    "vibration": ["on_off"],
    "window": ["on_off"]
};

const buttonClasses = {
    "None": ["on_off"],
    "identify": ["on_off"],
    "restart": ["on_off"],
    "update": ["on_off"]
};

// Generate a unique ID
function generateUniqueId(devTyp, devName) {
    const randomString = crypto.randomBytes(2).toString('hex').toUpperCase();
    return `${devName}${randomString}`;
}

// Prompt the user for input
function promptQuestion(question) {
    return new Promise(resolve => rl.question(question, resolve));
}

async function createDeviceConfig() {
    console.log("Welcome to the Home Assistant JSON Config Generator!");

    // Step 1: Collect device name
    const name = await promptQuestion("Enter the device name: ");

    // Step 2: Show device types with numbers and ask user to pick one
    console.log("\nPick a device type from the list (number corresponds to device type):");
    for (const [key, value] of Object.entries(deviceType)) {
        console.log(`${key}. ${value}`);
    }

    const devTypNumber = await promptQuestion("\nEnter the number corresponding to the device type: ");
    const devTyp = deviceType[devTypNumber];
    if (!devTyp) {
        console.log("Invalid device type.");
        rl.close();
        return;
    }

    // Step 3: If the device type is "Sensor", ask for a sensor class
    let sensorType, unitOfMeas;
    let valTpl = "{{ value_json.value }}"; // Default value template

    if (devTyp === "Sensor") {
        console.log("\nChoose a device class from the following options:");
        Object.keys(sensorClasses).forEach((sensor, index) => {
            console.log(`${index + 1}. ${sensor}`);
        });

        const sensorClassChoice = await promptQuestion("\nEnter the number corresponding to the sensor class: ");
        const sensorClassKey = Object.keys(sensorClasses)[parseInt(sensorClassChoice) - 1];
        
        if (!sensorClassKey) {
            console.log("Invalid sensor class.");
            rl.close();
            return;
        }

        sensorType = sensorClassKey; // Store the selected sensor class

        // Step 4: Allow the user to pick the unit of measurement
        const availableUnits = sensorClasses[sensorType];
        console.log(`\nChoose a unit of measurement for ${sensorType}:`);
        availableUnits.forEach((unit, index) => {
            console.log(`${index + 1}. ${unit}`);
        });

        const unitChoice = await promptQuestion("\nEnter the number corresponding to the unit of measurement: ");
        unitOfMeas = availableUnits[parseInt(unitChoice) - 1];

        // Set the value template based on the sensor type
        if (sensorType === "temperature") {
            valTpl = "{{ value_json.temperature }}";
        } else if (sensorType === "humidity") {
            valTpl = "{{ value_json.humidity }}";
        } else if (sensorType === "pressure") {
            valTpl = "{{ value_json.pressure }}";
        }
    }

    if (devTyp === "Binary Sensor") {
    console.log("\nChoose a binary sensor class from the following options:");
    Object.keys(binarySensorClasses).forEach((sensor, index) => {
        console.log(`${index + 1}. ${sensor}`);
    });

    const sensorClassChoice = await promptQuestion("\nEnter the number corresponding to the binary sensor class: ");
    const sensorClassKey = Object.keys(binarySensorClasses)[parseInt(sensorClassChoice) - 1];
    
    if (!sensorClassKey) {
        console.log("Invalid binary sensor class.");
        rl.close();
        return;
    }

    sensorType = sensorClassKey; // Store the selected binary sensor class

    // Step 4: Allow the user to pick the state (on/off) for the binary sensor
    const availableStates = binarySensorClasses[sensorType];
    console.log(`\nChoose a state for ${sensorType}:`);
    availableStates.forEach((state, index) => {
        console.log(`${index + 1}. ${state}`);
    });

    const stateChoice = await promptQuestion("\nEnter the number corresponding to the state (on/off): ");
    stateOfSensor = availableStates[parseInt(stateChoice) - 1];

    valTpl = "{{ value_json.value }}";
    }

    if (devTyp === "Button") {
    console.log("\nChoose a button class from the following options:");
    Object.keys(buttonClasses).forEach((sensor, index) => {
        console.log(`${index + 1}. ${sensor}`);
    });

    const sensorClassChoice = await promptQuestion("\nEnter the number corresponding to the button class: ");
    const sensorClassKey = Object.keys(buttonClasses)[parseInt(sensorClassChoice) - 1];
    
    if (!sensorClassKey) {
        console.log("Invalid button class.");
        rl.close();
        return;
    }

    sensorType = sensorClassKey; // Store the selected binary sensor class

    valTpl = "{{ value_json.value }}";
    }    
    
    // Step 5: Unique ID generation
    const uniqueIdChoice = await promptQuestion("Do you want to enter a unique ID manually? (yes/no): ");
    let uniqueId;
    if (uniqueIdChoice.toLowerCase() === "yes") {
        uniqueId = await promptQuestion("Enter the unique ID: ");
    } else {
        uniqueId = generateUniqueId(devTyp, name);
    }

    // Step 6: Collect optional fields under "dev"
    const dev = {
        name,
        ids: [name] // Default ids as the name
    };

    const manufacturer = await promptQuestion('Enter the manufacturer (optional): ');
    if (manufacturer) dev.mf = manufacturer;

    const model = await promptQuestion('Enter the model (optional): ');
    if (model) dev.mdl = model;

    const modelId = await promptQuestion('Enter the model ID (optional): ');
    if (modelId) dev.mdl_id = modelId;

    const serialNumber = await promptQuestion('Enter the serial number (optional): ');
    if (serialNumber) dev.sn = serialNumber;

    const hardwareVersion = await promptQuestion('Enter the hardware version (optional): ');
    if (hardwareVersion) dev.hw = hardwareVersion;

    const softwareVersion = await promptQuestion('Enter the software version (optional): ');
    if (softwareVersion) dev.sw = softwareVersion;

    const configurationUrl = await promptQuestion('Enter the configuration URL !!!!Must be a valid address!!!! (optional): ');
    if (configurationUrl) dev.cu = configurationUrl;

    // Step 7: State Topic (stat_t) generation
    const statT = `homeassistant/${devTyp.toLowerCase()}/${uniqueId}/state`;

    // Step 8: Build the device config
    const deviceConfig = {
        dev_cla: sensorType, // Now dev_cla is the selected sensor class name
        unit_of_meas: unitOfMeas || "None", // Default to "None" if no unit is required
        val_tpl: valTpl,
        stat_t: statT,
        unique_id: uniqueId,
        dev
    };

    // Step 9: Topic generation
    const Topic = `homeassistant/${devTyp.toLowerCase()}/${uniqueId}/config`;

    console.log("\nGenerated JSON Config:");
    console.log(JSON.stringify(deviceConfig, null, 2));

    console.log("\nGenerated Configuration Topic:");
    console.log(JSON.stringify(Topic, null, 2));

    console.log("\nGenerated Device State Update Topic:");
    console.log(JSON.stringify(statT, null, 2));

    rl.close();
}

createDeviceConfig();