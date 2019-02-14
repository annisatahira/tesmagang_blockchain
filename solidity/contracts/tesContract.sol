pragma solidity ^0.5.0;

contract ERC20Basic {
    uint256 public totalSupply;
    function balanceOf(address who) public view returns (uint256);
    function transfer(address to, uint256 value) public returns (bool);
    event Transfer(address indexed from, address indexed to, uint256 value);
}

library SafeMath {

    function mul(uint256 a, uint256 b) internal pure returns (uint256) {
        if (a == 0) {
            return 0;
        }
        uint256 c = a * b;
        assert(c / a == b);
        return c;
    }

    function div(uint256 a, uint256 b) internal pure returns (uint256) {
        uint256 c = a / b;
        return c;
    }

    function sub(uint256 a, uint256 b) internal pure returns (uint256) {
        assert(b <= a);
        return a - b;
    }

    function add(uint256 a, uint256 b) internal pure returns (uint256) {
        uint256 c = a + b;
        assert(c >= a);
        return c;
    }
}

contract BasicToken is ERC20Basic {
    using SafeMath for uint256;

    address public owner;
    address public newOwner;

    mapping(address => uint256) balances;

    modifier onlyOwner {
        require(msg.sender == owner);
        _;
    }

    event OwnershipTransferred(address indexed _from, address indexed _to);

    constructor () public {
        owner = msg.sender;
    }

    function transferOwnership(address _newOwner) public onlyOwner {
        newOwner = _newOwner;
    }
    function acceptOwnership() public {
        require(msg.sender == newOwner);
        emit OwnershipTransferred(owner, newOwner);
        owner = newOwner;
        newOwner = address(0);
    }

    function transfer(address _to, uint256 _value) public returns (bool) {
        require(_value > 0);
        require(_to != address(0));
        require(_value <= balances[msg.sender]);

        balances[msg.sender] = balances[msg.sender].sub(_value);
        balances[_to] = balances[_to].add(_value);
        emit Transfer(msg.sender, _to, _value);
        return true;
    }

    function balanceOf(address _owner) public view  returns (uint256 balance) {
        return balances[_owner];
    }

    function transferFrom(address _from, address _to, uint256 _value) public returns (bool) {
        require(_value > 0);
        require(_to != address(0));
        require(_value <= balances[_from]);

        balances[_from] = balances[_from].sub(_value);
        balances[_to] = balances[_to].add(_value);
        emit Transfer(_from, _to, _value);
        return true;

    }

    function totSupply() public view returns (uint256){
        return totalSupply;  
    }
    
    event IncreaseToken(
        string keterangan
    );

    function increaseTokenSupply(uint256 _value,string memory _ket) public onlyOwner {
        totalSupply = totalSupply.add(_value);
        balances[owner] = balances[owner].add(_value);
        emit Transfer(address(0),msg.sender,_value);
        emit IncreaseToken(_ket);

    }

    event NewTransferBalance(
        address indexed _from,
        address indexed _to,
        uint256 _value,
        string _status,
        string _message
    );

    function newTransferBalance(address _from,address _to, uint256 _value) public onlyOwner returns  (bool success) {
        if (_value <= 0 || balances[_from] <= _value){
            emit NewTransferBalance(_from, _to, _value,"failed","Transfer balance failed, balance not enough or amount not valid");
            return false;
        }else{  
            balances[_from] = balances[_from].sub(_value);
            balances[_to] = balances[_to].add(_value);

            emit NewTransferBalance(_from, _to, _value,"success","Transfer balance success, no problems found");
            emit Transfer(_from, _to, _value);
            return true;
        }
    }

}

contract BurnableToken is BasicToken {

    event Burn(address indexed burner, uint256 value);

    function burn(uint256 _value) public {
        require(_value > 0);
        require(_value <= balances[msg.sender]);

        address burner = msg.sender;
        balances[burner] = balances[burner].sub(_value);
        totalSupply = totalSupply.sub(_value);
        emit Burn(burner, _value);
    }
}


contract tesContract is BasicToken, BurnableToken {

    string public constant name = "Tes-Contract-AT2";
    string public constant symbol = "TCAT2";
    uint8 public constant decimals = 8;
    uint256 public constant INITIAL_SUPPLY = 200000000 * (10 ** uint256(decimals));

    constructor(address _superowner) public {
        owner = _superowner;
        totalSupply = INITIAL_SUPPLY;
        balances[msg.sender] = INITIAL_SUPPLY;
        emit Transfer(address(0), msg.sender, INITIAL_SUPPLY);
    }
}
