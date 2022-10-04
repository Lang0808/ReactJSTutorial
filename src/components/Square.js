function Square(props) {
    if (props.winner) {
      return <button className='win' onClick={props.onClick}>
        {props.value}
      </button>
    }
    return (
      <button className="square" onClick={props.onClick}>
        {props.value}
      </button>
    );
}

export default Square;