import * as React from 'react';

import { MessageSignalSizeDistribution } from './ecu-charts.jsx';

const e = React.createElement;

const hashStringToColor = str => {
    var hash = 5381;
    for (var i = 0; i < str.length; i++) {
        hash = ((hash << 5) + hash) + str.charCodeAt(i); /* hash * 33 + c */
    }
    var r = (hash & 0xFF0000) >> 16;
    var g = (hash & 0x00FF00) >> 8;
    var b = hash & 0x0000FF;
    return "#" + ("0" + r.toString(16)).substr(-2) + ("0" + g.toString(16)).substr(-2) + ("0" + b.toString(16)).substr(-2);
};

class FormGroupRow extends React.Component {

    render() {
        return (
            <div className='form-group col-md-4'>
                <label htmlFor='messageId'> {this.props.label}</label>
                <input type="text" readOnly="readOnly" className="form-control" id="messageId" value={this.props.value} ></input>
            </div>
        );
    }
}

class SignalBytes extends React.Component {

    render() {
        const PAYLOAD_BITS = [...Array(8 * 8).keys()];

        const bit_color_map = this.props.signals.reduce((acc, signal) => {
            const signalHash = signal.name + signal.offset + signal.signal_size + signal.start_bit;
            const color = hashStringToColor(signalHash);
            for (var i = signal.start_bit; i < (signal.start_bit + signal.signal_size); i++) {
                acc[i] = color;
            }
            return acc;
        }, []);



        const bits = PAYLOAD_BITS.reduce((acc, bitIndex) => {
            const color = bit_color_map[bitIndex];
            if (color == null) {
                const col = (<th key={'th' + this.props.id + bitIndex}>{bitIndex}</th>);
                acc.currentRow.push(col);
            } else {
                const col = (<th key={'th' + this.props.id + bitIndex} style={{ backgroundColor: color }}>{bitIndex}</th>);
                acc.currentRow.push(col);
            }

            if (bitIndex % 8 == 7) {
                const newRow = (<tr key={'tr' + this.props.id + bitIndex}>{acc.currentRow}</tr>);
                acc.rows.push(newRow);
                acc.currentRow = [];
            }

            return acc;
        }, { rows: [], currentRow: [] });

        return (
            <table key={this.props.id} className="table table-bordered signal-bytes">
                <tbody key={this.props.id}>
                    {bits.rows}
                </tbody>
            </table>
        );
    }
}

class DbcSignal extends React.Component {

    render() {
        const signalHash = this.props.name + this.props.offset + this.props.signal_size + this.props.start_bit;
        const headerStyle = { backgroundColor: hashStringToColor(signalHash) };
        let multiplex_indicator = this.props.multiplexer_indicator;
        if (typeof this.props.multiplexer_indicator === 'object') {
            multiplex_indicator = "Multiplexed Signal (" + this.props.multiplexer_indicator.MultiplexedSignal + ")";
        }
        return (<tbody>
            <tr>
                <th style={headerStyle}></th>
                <td key="name">{this.props.name}</td>
                <td key="byte_order">{this.props.byte_order}</td>
                <td key="factor">{this.props.factor}</td>
                <td key="min">{this.props.min}</td>
                <td key="max">{this.props.max}</td>
                <td key="multiplex_indicator">{multiplex_indicator}</td>
                <td key="offset">{this.props.offset}</td>
                <td key="signal_size">{this.props.signal_size}</td>
                <td key="start_bit">{this.props.start_bit}</td>
                <td key="unit">{this.props.unit}</td>
                <td key="value_type">{this.props.value_type}</td>
                <td key="value_type">{this.props.comment}</td>
            </tr>
        </tbody>
        );
    }
}

export class DbcMessage extends React.Component {
    render() {
        const signals = this.props.signals.map((signal) => {
            return e(DbcSignal, {
                key: signal.name,
                comment: this.props.signalCommentMap.get("" + this.props.id + signal.name),
                ...signal
            });
        });

        const can_id = "0x" + this.props.id.toString(16) + " (" + this.props.id + ")";

        return (
            <div className="dbc-message">
                <div className="card">
                    <div className="card-header bg-dark text-light">
                        <h2>{this.props.name}</h2>
                        {this.props.comment}
                    </div>
                    <div className="card-body">
                        <form>
                            <div className="form-row">
                                <FormGroupRow label="CAN-ID" value={can_id} />
                                <FormGroupRow label="Size" value={this.props.size} />
                                <FormGroupRow label="Transmitter" value={this.props.transmitter} />
                            </div>
                        </form>
                    </div>
                </div>
                <div className="card">
                    <div className="card-header border-dark">
                        <h5>Signals</h5>
                    </div>
                    <div className="card-body">
                        <table className="table table-hover table-light">
                            <thead className="thead-light">
                                <tr>
                                    <th key={this.props.id + 0}></th>
                                    <th key={this.props.id + 1}>Name</th>
                                    <th key={this.props.id + 2}>ByteOrder</th>
                                    <th key={this.props.id + 3}>Factor</th>
                                    <th key={this.props.id + 4}>Min</th>
                                    <th key={this.props.id + 5}>Max</th>
                                    <th key={this.props.id + 6}>MultiplexIndicator</th>
                                    <th key={this.props.id + 7}>Offset</th>
                                    <th key={this.props.id + 8}>Size (bits)</th>
                                    <th key={this.props.id + 9}>Start Bit</th>
                                    <th key={this.props.id + 10}>Unit</th>
                                    <th key={this.props.id + 11}>Value Type</th>
                                    <th key={this.props.id + 12}>Comment</th>
                                </tr>
                            </thead>
                            {signals}
                        </table>
                    </div>
                </div>
                <div className="card">
                    <div className="card-header border-dark">
                        <h5>Message Payload</h5>
                    </div>
                    <div className="card-body">
                        <SignalBytes signals={this.props.signals} />
                    </div>
                </div>
                <div className="card">
                    <div className="card-header border-dark">
                        <h5>Signal Size Distribution</h5>
                    </div>
                    <div className="card-body">
                        <MessageSignalSizeDistribution signals={this.props.signals} />
                    </div>
                </div>
            </div>
        );
    }
}
