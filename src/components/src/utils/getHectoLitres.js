export const getHectoliter = (productId, quantity) => {

  let HL=0;
  switch (productId?.trim()) {
    case "BEXEAR0500025L":
      HL = 0.125 * quantity;
      break;
    case "BEXEAR0300020L":
      HL = 0.06 * quantity;
      break;
    case "BETSTR0500020L":
      HL = 0.1 * quantity;
      break;
    case "BETSTR0300020L":
      HL = 0.06 * quantity;
      break;
    case "BEARER0500025L":
      HL = 0.125 * quantity;
      break;
    case "BEARER0300020L":
      HL = 0.06 * quantity;
      break;
    case "BNSRER0500020A":
      HL = 0.1 * quantity;
      break;
    case "BNSRER0330020A":
      HL = 0.066 * quantity;
      break;
    case "BNSREK30LT001L":
      HL = 0.3 * quantity;
      break;
    case "BP6PIR0500020A":
      HL = 0.1 * quantity;
      break;
    case "BP6PIR0330020A":
      HL = 0.066 * quantity;
      break;
    case "BP6PIK30LT001L":
      HL = 0.3 * quantity;
      break;
    case "BC9LTR0375020A":
      HL = 0.075 * quantity;
      break;
    case "BC9LTK30LT001L":
      HL = 0.3 * quantity;
      break;
    case "BC9LTC0330024M":
      HL = 0.079 * quantity;
      break;
    case "BNKSTR0330020L":
      HL = 0.066 * quantity;
      break;
    case "BBDRER0330024L":
      HL = 0.079 * quantity;
      break;
    case "HKIGXN0250035I":
      HL = 0.06 * quantity;
      break;
    case "AREREC0330024M":
      HL = 0.079 * quantity;
      break;
    case "BP6PIC0330024M":
      HL = 0.079 * quantity;
      break;
    case "BNSREC0330024M":
      HL = 0.079 * quantity;
      break;
    case "BSAREN0330024M":
      HL = 0.079 * quantity;
      break;
    default:
      break;
  }
  return HL;
};


