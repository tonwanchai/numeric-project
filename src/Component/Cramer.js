import React from 'react'
import { Button, Input } from 'antd'

import { create, all } from 'mathjs'
import apis from '../Container/API'
const config = {}
const math = create(all, config)

class Cramer extends React.Component {
    state = {
        n: 3,
        ans: null,
        matrix_A: [[], [], []],
        matrix_B: [null, null, null],
        ifer: null
    }
    async GetDatafromAPI() {
        let tmpData = null
        await apis.getAllMatrix().then(res => (tmpData = res.data));
        this.setState({ apiData: tmpData })
        
        this.setState({
            n: this.state.apiData[0]['n'],
            matrix_A: this.state.apiData[0]['matrixA'],
            matrix_B: this.state.apiData[0]['matrixB'],

        })

    }
    onClickExample = e => {
        this.GetDatafromAPI()
    }
    ShowMatrix_A = e => {
        let arr = [];
        let tmpMatrix = this.state.matrix_A;
        for (let i = 0; i < this.state.n; i++) {
            for (let j = 0; j < this.state.n; j++) {
                arr.push(<span style={{ margin: '2.5px' }}><Input name={(i).toString() + " " + (j).toString()} style={{ width: '50px', textAlign: 'center' }} onChange={this.onChangeMatrix} autoComplete="off" value={tmpMatrix[i][j]} /></span>)
            }
            arr.push(<div style={{ margin: '5px' }}></div>)
        }
        return (arr);
    }
    ShowMatrix_X = e => {
        let arr = [];

        for (let i = 0; i < this.state.n; i++) {
            for (let j = 0; j < 1; j++) {
                arr.push(<span style={{ margin: '2.5px', fontSize: '20px' }}>X{i + 1}</span>)
            }
            arr.push(<div style={{ margin: '5px' }}></div>)
        }
        return (arr);
    }
    ShowMatrix_B = e => {
        let arr = []
        let number = this.state.matrix_B;
        for (let i = 0; i < this.state.n; i++) {
            arr.push(<span style={{ margin: '2.5px' }}><Input name={(i).toString()} style={{ width: '50px', textAlign: 'center' }} onChange={this.onChangeMatrix_B} autocomplete="off" value={number[i]} /></span>)
            arr.push(<div style={{ margin: '5px' }}></div>)
        }
        return (arr);
    }

    onChangeMatrix = e => {
        let tmpIndex = e.target.name.split(" ");
        let tmpMt = this.state.matrix_A;
        tmpMt[parseInt(tmpIndex[0])][parseInt(tmpIndex[1])] = e.target.value;
        this.setState({ matrix_A: tmpMt });
    }
    onChangeMatrix_B = e => {
        let name = e.target.name.toString();
        let arr = this.state.matrix_B;
        let index = parseInt(name);
        arr[index] = e.target.value;
        //console.log(name);
        this.setState({ matrix_B: arr });
    }
    add_dm = (e) => {
        let n = this.state.n
        if (n < 8) {
            this.setState({ n: n + 1 })
        }
        else {
            return;
        }
        let arr_a = this.state.matrix_A;
        let arr_b = this.state.matrix_B;
        arr_a.push([]);
        arr_b.push(null);
        for (let i = 0; i < n + 1; i++) {
            arr_a[i].push(null);
        }
        this.setState({ matrix_A: arr_a });
        this.setState({ matrix_B: arr_b });
        //console.log(arr_a);
    }

    del_dm = (e) => {
        let n = this.state.n;
        if (n > 2) {
            this.setState({ n: n - 1 })
        }
        else {
            return;
        }
        let arr_a = this.state.matrix_A;
        let arr_b = this.state.matrix_B;
        arr_a.pop();
        arr_b.pop();
        for (let i = 0; i < n - 1; i++) {
            arr_a[i].pop();
        }
        this.setState({ matrix_A: arr_a });
        this.setState({ matrix_B: arr_b });
        //console.log(arr_a);
    }


    find_x = (e) => {
        
        if(this.state.matrix_B[0] === null){
            this.setState({ifer:(<div style={{color:'red'}}>โปรดกรอกข้อมูลให้ครบ</div>)})
            return
        }
        try {
            this.setState({ ifer: null })
            let n = this.state.n;
            let i_m_a = this.state.matrix_A;
            let i_m_b = this.state.matrix_B;

            let m_a = []
            let m_b = [].concat(i_m_b)

            for (let i = 0; i < n; i++) {
                m_a[i] = [].concat(i_m_a[i])
            }

            let det_A = math.det(m_a)
            det_A = det_A.toFixed(10)
            let x = []
            /*
            [[[1,2],[1,2]]]
            
            */
            for (let i = 0; i < n; i++) {
                x.push([])
                for (let j = 0; j < n; j++) {
                    x[i].push([].concat(m_a[j]))
                    x[i][j][i] = m_b[j]
                }
            }
            let ans_x = []

            for (let i = 0; i < n; i++) {
                ans_x.push(<div style={{ fontSize: '40px', fontWeight: 'bold' }}>Result of x{i + 1} is {math.det(x[i]).toFixed(10) / det_A}</div>);
            }
            this.setState({ ans: ans_x })
        } catch (error) {

            this.setState({ ifer: (<div style={{ color: 'red' }}>โปรดกรอกข้อมูลให้ครบ</div>) })
        }
        
    }
    render() {
        return (
            <div className="site-layout-background" style={{ padding: 24, textAlign: 'left' }}>
                <h1 className="header-content" style={{ fontSize: '20px' }}>Cramer</h1>

                <div>
                    <span style={{ marginLeft: '10px' }}><Button type="primary" onClick={this.del_dm} >-</Button></span>
                    <span style={{ marginLeft: '10px' }}>{this.state.n} x {this.state.n}</span>
                    <span style={{ marginLeft: '10px' }}><Button type="primary" onClick={this.add_dm} >+</Button></span>
                    
                </div>

                <div style={{ display: 'flex', flexFlow: 'row', marginTop: '5px' }}>
                    <div style={{ alignItems: 'center' }}>{this.ShowMatrix_A()}</div>
                    <div style={{ alignItems: 'center', marginLeft: '30px' }}>{this.ShowMatrix_X()}</div>
                    <div style={{ alignItems: 'center', marginLeft: '30px' }}>{this.ShowMatrix_B()}</div>
                </div>

                <div>
                    <Button style={{ marginLeft: '5px', width: '100px', marginTop: '5px' }} type='primary' onClick={this.onClickExample}>Example</Button>
                    <Button style={{ marginLeft: '5px', width: '100px', marginTop: '5px' }} type='primary' onClick={this.find_x}>Calculate</Button>
                </div>
                <div>{this.state.ifer}</div>
                <div>
                    {this.state.ans}
                </div>

            </div>
        );


    }
}

export default Cramer;

