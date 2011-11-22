// Calculate power and acceleration -------------------------------------------
var GravitySensorAlpha = function() {
    this.values = [];
    this.power = 0;
    this.accel = 0;

    this.calc = function() {
        var ave = [],
            I = this.values.length;
        i = I,
            dir = 0,
            total = 0;

        while (--i) {
            if (!dir) {
                dir = (this.values[i] < 0) ? -1 : 1;
            }
            var x = (this.values[i] - (10 * dir)) * 10;
            var x2 = ((this.values[i - 1] || 0) - (10 * dir)) * 10;
            this.power = (dir < 0) ? Math.min(x, this.power) : Math.max(x, this.power);
            if (I - i < 4 && x2) {
                ave.push(x - x2);
            }
        }

        var total = 0;
        for (i = 0; i < ave.length; i++) {
            total += ave[i];
        }
        accel = total / ave.length;
    };

    this.result = function() {
        return {
            power: this.power,
            accel: this.accel
        }
    };
}

var RotationSensorAlpha = function() {
    this.values = [];
    this.power = 0;
    this.accel = 0;

    this.calc = function() {
        var ave = [],
            I = this.values.length
        i = I,
            total = 0;

        while (--i) {
            var x = this.values[i] * .1;
            var x2 = (this.values[i - 1] || 0) * .1;
            this.power = (this.values[i] < 0) ? Math.min(x, this.power) : Math.max(x, this.power);
            if (I - i < 4 && x2) {
                ave.push(x - x2);
            }
        }

        var total = 0;
        for (i = 0; i < ave.length; i++) {
            total += ave[i];
        }
        accel = total / ave.length;
    };

    this.result = function() {
        return {
            power: this.power,
            accel: this.accel
        }
    };
}

var calcSwing = function() {
    var samples = playr.orient.length;

    var ax = new GravitySensorAlpha(),
        ay = new GravitySensorAlpha(),
        az = new GravitySensorAlpha(),
        ra = new RotationSensorAlpha(),
        rb = new RotationSensorAlpha(),
        rg = new RotationSensorAlpha();

    for (var i = 0; i < samples; i++) {
        ax.values.push(playr.orient[i].ax);
        ay.values.push(playr.orient[i].ay);
        az.values.push(playr.orient[i].az);
        ra.values.push(playr.orient[i].ra);
        rb.values.push(playr.orient[i].rb);
        rg.values.push(playr.orient[i].rg);
    }

    ax.calc();
    ay.calc();
    az.calc();
    ra.calc();
    rb.calc();
    rg.calc();

    return {
        ax: ax.result(),
        ay: ay.result(),
        az: az.result(),
        ra: ra.result(),
        rb: rb.result(),
        rg: rg.result()
    };
};


// Logging --------------------------------------------------------------------
var output = function() {
    var table = document.createElement('table');
    for (var i = 0; i < playr.orient.length; i++) {
        var row = document.createElement('tr');
        table.appendChild(row);
        for (var ii in playr.orient[i]) {
            var col = document.createElement('td');
            var txt = document.createTextNode(playr.orient[i][ii]);
            col.appendChild(txt);
            row.appendChild(col);
        }
    }
    document.body.appendChild(table);
};

var outputText = function(text) {
    console.log('outputText');
    console.log(text);
    var div = document.createElement('div');
    var txt = document.createTextNode(text);
    div.appendChild(txt);
    playr.main.appendChild(div);
};