// inboxy: Chrome extension for Google Inbox-style bundles in Gmail.
// Copyright (C) 2020  Teresa Ou

// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.

// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.

/**
 * A color.
 */
class RGBColor {
    constructor(...args) {
        if (args.length == 1
            && (typeof(args[0]) === 'string' || args[0] instanceof String)) {
            this._fromString(args[0])
        } else if (3 <= args.length && args.length <= 4) {
            this._r = args[0];
            this._g = args[1];
            this._b = args[2];
            if (args.length > 3) {
                this._a = args[3];
            }
        }
    }

    _fromString(str) {
        //TODO// parse str with a regexp instead
        const rgbaToString = function() { return `rgba(${this._r},${this._g},${this._b},${this._a})`; };
        const rgb  = (r,g,b)   => { return {_r:r, _g:g, _b:b, _a:1, toString: rgbaToString}; },
              rgba = (r,g,b,a) => { return {_r:r, _g:g, _b:b, _a:a, toString: rgbaToString}; };
        Object.assign(this, eval(str));
    }

    toString() {
        if (this._a !== undefined) {
            return `rgba(${this._r},${this._g},${this._b},${this._a})`;
        } else {
            return `rgb(${this._r},${this._g},${this._b})`;
        }
    }
}

export default RGBColor;
