function setIndexValue(index) {
  let value = 0;

  switch (index) {
    case 0:
      value = 85;
      break;
    case 1:
      value = 110;
      break;
    case 2:
      value = 135;
      break;
    case 3:
      value = 160;
      break;
    case 4:
      value = 185;
      break;
    case 5:
      value = 210;
      break;
    case 6:
      value = 235;
      break;
    case 7:
      value = 260;
      break;
    case 8:
      value = 285;
      break;
    case 9:
      value = 310;
      break;
    default:
      value = 80;
  }
  return value;
}

export { setIndexValue };
