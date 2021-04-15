import React, {Component} from 'react';

export default class LoginComponent extends Component {
    
    //props are properties of the component, which are passed in as input.
    constructor(props) {
        super(props)
    }

    render() { //The return value of this function is rendered ( displayed ) on the screen. 
        const element = (<div>Text from Element</div>)
        return (<div className="comptext">
        <h3>First Component</h3>
            {this.props.displaytext} 
            {element}
        </div>)

    } // the curly braces in this JSX text is nothing but plain JS values.
}