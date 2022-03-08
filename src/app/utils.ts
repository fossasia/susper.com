/**
 * This function coerces a string into a string literal type.
 * Using tagged union types in TypeScript 2.0, this enables
 * powerful typechecking of our reducers.
 *
 * Since every action label passes through this function it
 * is a good place to ensure all of our action labels
 * are unique.
 */
let typeCache: { [label: string]: boolean } = {};
export function type<T>(label: T | ''): T {
  if (typeCache[<string>label]) {
    throw new Error(`Action type "${label}" is not unique"`);
  }

  typeCache[<string>label] = true;

  return <T>label;
}

export function validateMessage(message) {
  if (message && message.length >= 100) {
    return true;
  } else {
    return false;
  }
}

export function validatePhone(phone) {
  if (phone && phone.toString().length >= 10) {
    return true;
  } else {
    return false;
  }
}

export function validateEmail(email) {
  if (email) {
    let re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  } else {
    return false;
  }
}

export function validateName(name) {
  if (name && name.length > 0) {
    return true;
  } else {
    return false;
  }
}

export const countryCodeList = [
  { value: '213', description: 'Algeria (+213)' },
  { value: '213', description: 'Algeria (+213)' },
  { value: '376', description: 'Andorra (+376)' },
  { value: '244', description: 'Angola (+244)' },
  { value: '1264', description: 'Anguilla (+1264)' },
  { value: '1268', description: 'Antigua &amp; Barbuda (+1268)' },
  { value: '54', description: 'Argentina (+54)' },
  { value: '374', description: 'Armenia (+374)' },
  { value: '297', description: 'Aruba (+297)' },
  { value: '61', description: 'Australia (+61)' },
  { value: '43', description: 'Austria (+43)' },
  { value: '994', description: 'Azerbaijan (+994)' },
  { value: '1242', description: 'Bahamas (+1242)' },
  { value: '973', description: 'Bahrain (+973)' },
  { value: '880', description: 'Bangladesh (+880)' },
  { value: '1246', description: 'Barbados (+1246)' },
  { value: '375', description: 'Belarus (+375)' },
  { value: '32', description: 'Belgium (+32)' },
  { value: '501', description: 'Belize (+501)' },
  { value: '229', description: 'Benin (+229)' },
  { value: '1441', description: 'Bermuda (+1441)' },
  { value: '975', description: 'Bhutan (+975)' },
  { value: '591', description: 'Bolivia (+591)' },
  { value: '387', description: 'Bosnia Herzegovina (+387)' },
  { value: '267', description: 'Botswana (+267)' },
  { value: '55', description: 'Brazil (+55)' },
  { value: '673', description: 'Brunei (+673)' },
  { value: '359', description: 'Bulgaria (+359)' },
  { value: '226', description: 'Burkina Faso (+226)' },
  { value: '257', description: 'Burundi (+257)' },
  { value: '855', description: 'Cambodia (+855)' },
  { value: '237', description: 'Cameroon (+237)' },
  { value: '1', description: 'Canada (+1)' },
  { value: '238', description: 'Cape Verde Islands (+238)' },
  { value: '1345', description: 'Cayman Islands (+1345)' },
  { value: '236', description: 'Central African Republic (+236)' },
  { value: '56', description: 'Chile (+56)' },
  { value: '86', description: 'China (+86)' },
  { value: '57', description: 'Colombia (+57)' },
  { value: '269', description: 'Comoros (+269)' },
  { value: '242', description: 'Congo (+242)' },
  { value: '682', description: 'Cook Islands (+682)' },
  { value: '506', description: 'Costa Rica (+506)' },
  { value: '385', description: 'Croatia (+385)' },
  { value: '53', description: 'Cuba (+53)' },
  { value: '90392', description: 'Cyprus North (+90392)' },
  { value: '357', description: 'Cyprus South (+357)' },
  { value: '42', description: 'Czech Republic (+42)' },
  { value: '45', description: 'Denmark (+45)' },
  { value: '253', description: 'Djibouti (+253)' },
  { value: '1809', description: 'Dominica (+1809)' },
  { value: '1809', description: 'Dominican Republic (+1809)' },
  { value: '593', description: 'Ecuador (+593)' },
  { value: '20', description: 'Egypt (+20)' },
  { value: '503', description: 'El Salvador (+503)' },
  { value: '240', description: 'Equatorial Guinea (+240)' },
  { value: '291', description: 'Eritrea (+291)' },
  { value: '372', description: 'Estonia (+372)' },
  { value: '251', description: 'Ethiopia (+251)' },
  { value: '500', description: 'Falkland Islands (+500)' },
  { value: '298', description: 'Faroe Islands (+298)' },
  { value: '679', description: 'Fiji (+679)' },
  { value: '358', description: 'Finland (+358)' },
  { value: '33', description: 'France (+33)' },
  { value: '594', description: 'French Guiana (+594)' },
  { value: '689', description: 'French Polynesia (+689)' },
  { value: '241', description: 'Gabon (+241)' },
  { value: '220', description: 'Gambia (+220)' },
  { value: '7880', description: 'Georgia (+7880)' },
  { value: '49', description: 'Germany (+49)' },
  { value: '233', description: 'Ghana (+233)' },
  { value: '350', description: 'Gibraltar (+350)' },
  { value: '30', description: 'Greece (+30)' },
  { value: '299', description: 'Greenland (+299)' },
  { value: '1473', description: 'Grenada (+1473)' },
  { value: '590', description: 'Guadeloupe (+590)' },
  { value: '671', description: 'Guam (+671)' },
  { value: '502', description: 'Guatemala (+502)' },
  { value: '224', description: 'Guinea (+224)' },
  { value: '245', description: 'Guinea - Bissau (+245)' },
  { value: '592', description: 'Guyana (+592)' },
  { value: '509', description: 'Haiti (+509)' },
  { value: '504', description: 'Honduras (+504)' },
  { value: '852', description: 'Hong Kong (+852)' },
  { value: '36', description: 'Hungary (+36)' },
  { value: '354', description: 'Iceland (+354)' },
  { value: '91', description: 'India (+91)' },
  { value: '62', description: 'Indonesia (+62)' },
  { value: '98', description: 'Iran (+98)' },
  { value: '964', description: 'Iraq (+964)' },
  { value: '353', description: 'Ireland (+353)' },
  { value: '972', description: 'Israel (+972)' },
  { value: '39', description: 'Italy (+39)' },
  { value: '1876', description: 'Jamaica (+1876)' },
  { value: '81', description: 'Japan (+81)' },
  { value: '962', description: 'Jordan (+962)' },
  { value: '7', description: 'Kazakhstan (+7)' },
  { value: '254', description: 'Kenya (+254)' },
  { value: '686', description: 'Kiribati (+686)' },
  { value: '850', description: 'Korea North (+850)' },
  { value: '82', description: 'Korea South (+82)' },
  { value: '965', description: 'Kuwait (+965)' },
  { value: '996', description: 'Kyrgyzstan (+996)' },
  { value: '856', description: 'Laos (+856)' },
  { value: '371', description: 'Latvia (+371)' },
  { value: '961', description: 'Lebanon (+961)' },
  { value: '266', description: 'Lesotho (+266)' },
  { value: '231', description: 'Liberia (+231)' },
  { value: '218', description: 'Libya (+218)' },
  { value: '417', description: 'Liechtenstein (+417)' },
  { value: '370', description: 'Lithuania (+370)' },
  { value: '352', description: 'Luxembourg (+352)' },
  { value: '853', description: 'Macao (+853)' },
  { value: '389', description: 'Macedonia (+389)' },
  { value: '261', description: 'Madagascar (+261)' },
  { value: '265', description: 'Malawi (+265)' },
  { value: '60', description: 'Malaysia (+60)' },
  { value: '960', description: 'Maldives (+960)' },
  { value: '223', description: 'Mali (+223)' },
  { value: '356', description: 'Malta (+356)' },
  { value: '692', description: 'Marshall Islands (+692)' },
  { value: '596', description: 'Martinique (+596)' },
  { value: '222', description: 'Mauritania (+222)' },
  { value: '269', description: 'Mayotte (+269)' },
  { value: '52', description: 'Mexico (+52)' },
  { value: '691', description: 'Micronesia (+691)' },
  { value: '373', description: 'Moldova (+373)' },
  { value: '377', description: 'Monaco (+377)' },
  { value: '976', description: 'Mongolia (+976)' },
  { value: '1664', description: 'Montserrat (+1664)' },
  { value: '212', description: 'Morocco (+212)' },
  { value: '258', description: 'Mozambique (+258)' },
  { value: '95', description: 'Myanmar (+95)' },
  { value: '264', description: 'Namibia (+264)' },
  { value: '674', description: 'Nauru (+674)' },
  { value: '977', description: 'Nepal (+977)' },
  { value: '31', description: 'Netherlands (+31)' },
  { value: '687', description: 'New Caledonia (+687)' },
  { value: '64', description: 'New Zealand (+64)' },
  { value: '505', description: 'Nicaragua (+505)' },
  { value: '227', description: 'Niger (+227)' },
  { value: '234', description: 'Nigeria (+234)' },
  { value: '683', description: 'Niue (+683)' },
  { value: '672', description: 'Norfolk Islands (+672)' },
  { value: '670', description: 'Northern Marianas (+670)' },
  { value: '47', description: 'Norway (+47)' },
  { value: '968', description: 'Oman (+968)' },
  { value: '680', description: 'Palau (+680)' },
  { value: '507', description: 'Panama (+507)' },
  { value: '675', description: 'Papua New Guinea (+675)' },
  { value: '595', description: 'Paraguay (+595)' },
  { value: '51', description: 'Peru (+51)' },
  { value: '63', description: 'Philippines (+63)' },
  { value: '48', description: 'Poland (+48)' },
  { value: '351', description: 'Portugal (+351)' },
  { value: '1787', description: 'Puerto Rico (+1787)' },
  { value: '974', description: 'Qatar (+974)' },
  { value: '262', description: 'Reunion (+262)' },
  { value: '40', description: 'Romania (+40)' },
  { value: '7', description: 'Russia (+7)' },
  { value: '250', description: 'Rwanda (+250)' },
  { value: '378', description: 'San Marino (+378)' },
  { value: '239', description: 'Sao Tome &amp; Principe (+239)' },
  { value: '966', description: 'Saudi Arabia (+966)' },
  { value: '221', description: 'Senegal (+221)' },
  { value: '381', description: 'Serbia (+381)' },
  { value: '248', description: 'Seychelles (+248)' },
  { value: '232', description: 'Sierra Leone (+232)' },
  { value: '65', description: 'Singapore (+65)' },
  { value: '421', description: 'Slovak Republic (+421)' },
  { value: '386', description: 'Slovenia (+386)' },
  { value: '677', description: 'Solomon Islands (+677)' },
  { value: '252', description: 'Somalia (+252)' },
  { value: '27', description: 'South Africa (+27)' },
  { value: '34', description: 'Spain (+34)' },
  { value: '94', description: 'Sri Lanka (+94)' },
  { value: '290', description: 'St. Helena (+290)' },
  { value: '1869', description: 'St. Kitts (+1869)' },
  { value: '1758', description: 'St. Lucia (+1758)' },
  { value: '249', description: 'Sudan (+249)' },
  { value: '597', description: 'Suriname (+597)' },
  { value: '268', description: 'Swaziland (+268)' },
  { value: '46', description: 'Sweden (+46)' },
  { value: '41', description: 'Switzerland (+41)' },
  { value: '963', description: 'Syria (+963)' },
  { value: '886', description: 'Taiwan (+886)' },
  { value: '7', description: 'Tajikstan (+7)' },
  { value: '66', description: 'Thailand (+66)' },
  { value: '228', description: 'Togo (+228)' },
  { value: '676', description: 'Tonga (+676)' },
  { value: '1868', description: 'Trinidad &amp; Tobago (+1868)' },
  { value: '216', description: 'Tunisia (+216)' },
  { value: '90', description: 'Turkey (+90)' },
  { value: '7', description: 'Turkmenistan (+7)' },
  { value: '993', description: 'Turkmenistan (+993)' },
  { value: '1649', description: 'Turks &amp; Caicos Islands (+1649)' },
  { value: '688', description: 'Tuvalu (+688)' },
  { value: '256', description: 'Uganda (+256)' },
  { value: '44', description: 'UK (+44)' },
  { value: '380', description: 'Ukraine (+380)' },
  { value: '971', description: 'United Arab Emirates (+971)' },
  { value: '598', description: 'Uruguay (+598)' },
  { value: '1', description: 'USA (+1)' },
  { value: '7', description: 'Uzbekistan (+7)' },
  { value: '678', description: 'Vanuatu (+678)' },
  { value: '379', description: 'Vatican City (+379)' },
  { value: '58', description: 'Venezuela (+58)' },
  { value: '84', description: 'Vietnam (+84)' },
  { value: '84', description: 'Virgin Islands - British (+1284)' },
  { value: '84', description: 'Virgin Islands - US (+1340)' },
  { value: '681', description: 'Wallis &amp; Futuna (+681)' },
  { value: '969', description: 'Yemen (North) (+969)' },
  { value: '967', description: 'Yemen (South) (+967)' },
  { value: '260', description: 'Zambia (+260)' },
  { value: '263', description: 'Zimbabwe (+263)' },
];
