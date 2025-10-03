import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import QRCode from 'qrcode';
import { PaymentProvider } from '../contexts/PaymentContext';
import QRPaymentStep from '../components/QRPaymentStep';
import RoomRow from '../components/RoomRow';
import apiService from '../services/api';
import './Booking.css';

const Booking = () => {
  const [searchParams] = useSearchParams();
  const [currentStep, setCurrentStep] = useState(1);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bookingData, setBookingData] = useState({
    // Step 1: Room & Dates
    roomId: searchParams.get('room') || '',
    checkIn: '',
    checkOut: '',
    guests: 1,
    
    // Step 2: Guest Details
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    nationality: '',
    
    // Step 3: Payment
    paymentMethod: 'promptpay',
    promptpayId: '',
    
    // Step 4: Confirmation
    specialRequests: ''
  });

  // Searchable nationality dropdown state
  const [nationalitySearch, setNationalitySearch] = useState('');
  const [showNationalityDropdown, setShowNationalityDropdown] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });
  const nationalityDropdownRef = useRef(null);
  const nationalityInputRef = useRef(null);

  // Phone country code dropdown state
  const [phoneCountryCode, setPhoneCountryCode] = useState('+66');
  const [phoneCountryCodeSearch, setPhoneCountryCodeSearch] = useState('');
  const [showPhoneCodeDropdown, setShowPhoneCodeDropdown] = useState(false);
  const [phoneCodeDropdownPosition, setPhoneCodeDropdownPosition] = useState({ top: 0, left: 0, width: 0 });
  const phoneCodeDropdownRef = useRef(null);
  const phoneCodeInputRef = useRef(null);

  // Fetch rooms from database
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setLoading(true);
        const response = await apiService.getRooms();
        if (response.success) {
          // Transform database data to match component expectations
          const roomsData = response.data.map(room => ({
            id: room.id,
            name: room.name,
            price: room.base_price,
            type: room.room_type,
            size: `${room.size_sqm}m²`,
            capacity: room.capacity,
            amenities: room.amenities_th || room.amenities, // Use Thai amenities if available
            description: room.description,
            available: room.is_available,
            image: room.main_image_url
          }));
          setRooms(roomsData);
        } else {
          setError('Failed to load rooms');
        }
      } catch (err) {
        console.error('Error fetching rooms:', err);
        setError('Failed to connect to server');
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  const nationalities = [
    'Afghan', 'Albanian', 'Algerian', 'American', 'Andorran', 'Angolan', 'Antiguan', 'Argentine', 'Armenian', 'Australian',
    'Austrian', 'Azerbaijani', 'Bahamian', 'Bahraini', 'Bangladeshi', 'Barbadian', 'Belarusian', 'Belgian', 'Belizean', 'Beninese',
    'Bhutanese', 'Bolivian', 'Bosnian', 'Botswanan', 'Brazilian', 'British', 'Bruneian', 'Bulgarian', 'Burkinabé', 'Burundian',
    'Cambodian', 'Cameroonian', 'Canadian', 'Cape Verdean', 'Central African', 'Chadian', 'Chilean', 'Chinese', 'Colombian', 'Comoran',
    'Congolese', 'Costa Rican', 'Croatian', 'Cuban', 'Cypriot', 'Czech', 'Danish', 'Djiboutian', 'Dominican', 'Dutch',
    'East Timorese', 'Ecuadorean', 'Egyptian', 'Emirati', 'English', 'Equatorial Guinean', 'Eritrean', 'Estonian', 'Ethiopian', 'Fijian',
    'Filipino', 'Finnish', 'French', 'Gabonese', 'Gambian', 'Georgian', 'German', 'Ghanaian', 'Greek', 'Grenadian',
    'Guatemalan', 'Guinean', 'Guyanese', 'Haitian', 'Honduran', 'Hungarian', 'Icelandic', 'Indian', 'Indonesian', 'Iranian',
    'Iraqi', 'Irish', 'Israeli', 'Italian', 'Ivorian', 'Jamaican', 'Japanese', 'Jordanian', 'Kazakhstani', 'Kenyan',
    'Kittian and Nevisian', 'Kuwaiti', 'Kyrgyz', 'Laotian', 'Latvian', 'Lebanese', 'Liberian', 'Libyan', 'Liechtensteiner', 'Lithuanian',
    'Luxembourger', 'Macedonian', 'Malagasy', 'Malawian', 'Malaysian', 'Maldivan', 'Malian', 'Maltese', 'Marshallese', 'Mauritanian',
    'Mauritian', 'Mexican', 'Micronesian', 'Moldovan', 'Monacan', 'Mongolian', 'Montenegrin', 'Moroccan', 'Mosotho', 'Motswana',
    'Mozambican', 'Namibian', 'Nauruan', 'Nepalese', 'New Zealander', 'Nicaraguan', 'Nigerian', 'Nigerien', 'North Korean', 'Northern Irish',
    'Norwegian', 'Omani', 'Pakistani', 'Palauan', 'Panamanian', 'Papua New Guinean', 'Paraguayan', 'Peruvian', 'Polish', 'Portuguese',
    'Qatari', 'Romanian', 'Russian', 'Rwandan', 'Saint Lucian', 'Salvadoran', 'Samoan', 'San Marinese', 'São Toméan', 'Saudi Arabian',
    'Scottish', 'Senegalese', 'Serbian', 'Seychellois', 'Sierra Leonean', 'Singaporean', 'Slovakian', 'Slovenian', 'Solomon Islander', 'Somali',
    'South African', 'South Korean', 'South Sudanese', 'Spanish', 'Sri Lankan', 'Sudanese', 'Surinamer', 'Swazi', 'Swedish', 'Swiss',
    'Syrian', 'Taiwanese', 'Tajikistani', 'Tanzanian', 'Thai', 'Togolese', 'Tongan', 'Trinidadian or Tobagonian', 'Tunisian', 'Turkish',
    'Tuvaluan', 'Ugandan', 'Ukrainian', 'Uruguayan', 'Uzbekistani', 'Venezuelan', 'Vietnamese', 'Welsh', 'Yemenite', 'Zambian', 'Zimbabwean'
  ];

  const countryCodes = [
    { code: '+1', country: 'United States', flag: '🇺🇸' },
    { code: '+1', country: 'Canada', flag: '🇨🇦' },
    { code: '+7', country: 'Russia', flag: '🇷🇺' },
    { code: '+7', country: 'Kazakhstan', flag: '🇰🇿' },
    { code: '+20', country: 'Egypt', flag: '🇪🇬' },
    { code: '+27', country: 'South Africa', flag: '🇿🇦' },
    { code: '+30', country: 'Greece', flag: '🇬🇷' },
    { code: '+31', country: 'Netherlands', flag: '🇳🇱' },
    { code: '+32', country: 'Belgium', flag: '🇧🇪' },
    { code: '+33', country: 'France', flag: '🇫🇷' },
    { code: '+34', country: 'Spain', flag: '🇪🇸' },
    { code: '+36', country: 'Hungary', flag: '🇭🇺' },
    { code: '+39', country: 'Italy', flag: '🇮🇹' },
    { code: '+40', country: 'Romania', flag: '🇷🇴' },
    { code: '+41', country: 'Switzerland', flag: '🇨🇭' },
    { code: '+43', country: 'Austria', flag: '🇦🇹' },
    { code: '+44', country: 'United Kingdom', flag: '🇬🇧' },
    { code: '+45', country: 'Denmark', flag: '🇩🇰' },
    { code: '+46', country: 'Sweden', flag: '🇸🇪' },
    { code: '+47', country: 'Norway', flag: '🇳🇴' },
    { code: '+48', country: 'Poland', flag: '🇵🇱' },
    { code: '+49', country: 'Germany', flag: '🇩🇪' },
    { code: '+51', country: 'Peru', flag: '🇵🇪' },
    { code: '+52', country: 'Mexico', flag: '🇲🇽' },
    { code: '+53', country: 'Cuba', flag: '🇨🇺' },
    { code: '+54', country: 'Argentina', flag: '🇦🇷' },
    { code: '+55', country: 'Brazil', flag: '🇧🇷' },
    { code: '+56', country: 'Chile', flag: '🇨🇱' },
    { code: '+57', country: 'Colombia', flag: '🇨🇴' },
    { code: '+58', country: 'Venezuela', flag: '🇻🇪' },
    { code: '+60', country: 'Malaysia', flag: '🇲🇾' },
    { code: '+61', country: 'Australia', flag: '🇦🇺' },
    { code: '+62', country: 'Indonesia', flag: '🇮🇩' },
    { code: '+63', country: 'Philippines', flag: '🇵🇭' },
    { code: '+64', country: 'New Zealand', flag: '🇳🇿' },
    { code: '+65', country: 'Singapore', flag: '🇸🇬' },
    { code: '+66', country: 'Thailand', flag: '🇹🇭' },
    { code: '+81', country: 'Japan', flag: '🇯🇵' },
    { code: '+82', country: 'South Korea', flag: '🇰🇷' },
    { code: '+84', country: 'Vietnam', flag: '🇻🇳' },
    { code: '+86', country: 'China', flag: '🇨🇳' },
    { code: '+90', country: 'Turkey', flag: '🇹🇷' },
    { code: '+91', country: 'India', flag: '🇮🇳' },
    { code: '+92', country: 'Pakistan', flag: '🇵🇰' },
    { code: '+93', country: 'Afghanistan', flag: '🇦🇫' },
    { code: '+94', country: 'Sri Lanka', flag: '🇱🇰' },
    { code: '+95', country: 'Myanmar', flag: '🇲🇲' },
    { code: '+98', country: 'Iran', flag: '🇮🇷' },
    { code: '+212', country: 'Morocco', flag: '🇲🇦' },
    { code: '+213', country: 'Algeria', flag: '🇩🇿' },
    { code: '+216', country: 'Tunisia', flag: '🇹🇳' },
    { code: '+218', country: 'Libya', flag: '🇱🇾' },
    { code: '+220', country: 'Gambia', flag: '🇬🇲' },
    { code: '+221', country: 'Senegal', flag: '🇸🇳' },
    { code: '+222', country: 'Mauritania', flag: '🇲🇷' },
    { code: '+223', country: 'Mali', flag: '🇲🇱' },
    { code: '+224', country: 'Guinea', flag: '🇬🇳' },
    { code: '+225', country: 'Ivory Coast', flag: '🇨🇮' },
    { code: '+226', country: 'Burkina Faso', flag: '🇧🇫' },
    { code: '+227', country: 'Niger', flag: '🇳🇪' },
    { code: '+228', country: 'Togo', flag: '🇹🇬' },
    { code: '+229', country: 'Benin', flag: '🇧🇯' },
    { code: '+230', country: 'Mauritius', flag: '🇲🇺' },
    { code: '+231', country: 'Liberia', flag: '🇱🇷' },
    { code: '+232', country: 'Sierra Leone', flag: '🇸🇱' },
    { code: '+233', country: 'Ghana', flag: '🇬🇭' },
    { code: '+234', country: 'Nigeria', flag: '🇳🇬' },
    { code: '+235', country: 'Chad', flag: '🇹🇩' },
    { code: '+236', country: 'Central African Republic', flag: '🇨🇫' },
    { code: '+237', country: 'Cameroon', flag: '🇨🇲' },
    { code: '+238', country: 'Cape Verde', flag: '🇨🇻' },
    { code: '+239', country: 'São Tomé and Príncipe', flag: '🇸🇹' },
    { code: '+240', country: 'Equatorial Guinea', flag: '🇬🇶' },
    { code: '+241', country: 'Gabon', flag: '🇬🇦' },
    { code: '+242', country: 'Republic of the Congo', flag: '🇨🇬' },
    { code: '+243', country: 'Democratic Republic of the Congo', flag: '🇨🇩' },
    { code: '+244', country: 'Angola', flag: '🇦🇴' },
    { code: '+245', country: 'Guinea-Bissau', flag: '🇬🇼' },
    { code: '+246', country: 'British Indian Ocean Territory', flag: '🇮🇴' },
    { code: '+248', country: 'Seychelles', flag: '🇸🇨' },
    { code: '+249', country: 'Sudan', flag: '🇸🇩' },
    { code: '+250', country: 'Rwanda', flag: '🇷🇼' },
    { code: '+251', country: 'Ethiopia', flag: '🇪🇹' },
    { code: '+252', country: 'Somalia', flag: '🇸🇴' },
    { code: '+253', country: 'Djibouti', flag: '🇩🇯' },
    { code: '+254', country: 'Kenya', flag: '🇰🇪' },
    { code: '+255', country: 'Tanzania', flag: '🇹🇿' },
    { code: '+256', country: 'Uganda', flag: '🇺🇬' },
    { code: '+257', country: 'Burundi', flag: '🇧🇮' },
    { code: '+258', country: 'Mozambique', flag: '🇲🇿' },
    { code: '+260', country: 'Zambia', flag: '🇿🇲' },
    { code: '+261', country: 'Madagascar', flag: '🇲🇬' },
    { code: '+262', country: 'Réunion', flag: '🇷🇪' },
    { code: '+263', country: 'Zimbabwe', flag: '🇿🇼' },
    { code: '+264', country: 'Namibia', flag: '🇳🇦' },
    { code: '+265', country: 'Malawi', flag: '🇲🇼' },
    { code: '+266', country: 'Lesotho', flag: '🇱🇸' },
    { code: '+267', country: 'Botswana', flag: '🇧🇼' },
    { code: '+268', country: 'Swaziland', flag: '🇸🇿' },
    { code: '+269', country: 'Comoros', flag: '🇰🇲' },
    { code: '+290', country: 'Saint Helena', flag: '🇸🇭' },
    { code: '+291', country: 'Eritrea', flag: '🇪🇷' },
    { code: '+297', country: 'Aruba', flag: '🇦🇼' },
    { code: '+298', country: 'Faroe Islands', flag: '🇫🇴' },
    { code: '+299', country: 'Greenland', flag: '🇬🇱' },
    { code: '+350', country: 'Gibraltar', flag: '🇬🇮' },
    { code: '+351', country: 'Portugal', flag: '🇵🇹' },
    { code: '+352', country: 'Luxembourg', flag: '🇱🇺' },
    { code: '+353', country: 'Ireland', flag: '🇮🇪' },
    { code: '+354', country: 'Iceland', flag: '🇮🇸' },
    { code: '+355', country: 'Albania', flag: '🇦🇱' },
    { code: '+356', country: 'Malta', flag: '🇲🇹' },
    { code: '+357', country: 'Cyprus', flag: '🇨🇾' },
    { code: '+358', country: 'Finland', flag: '🇫🇮' },
    { code: '+359', country: 'Bulgaria', flag: '🇧🇬' },
    { code: '+370', country: 'Lithuania', flag: '🇱🇹' },
    { code: '+371', country: 'Latvia', flag: '🇱🇻' },
    { code: '+372', country: 'Estonia', flag: '🇪🇪' },
    { code: '+373', country: 'Moldova', flag: '🇲🇩' },
    { code: '+374', country: 'Armenia', flag: '🇦🇲' },
    { code: '+375', country: 'Belarus', flag: '🇧🇾' },
    { code: '+376', country: 'Andorra', flag: '🇦🇩' },
    { code: '+377', country: 'Monaco', flag: '🇲🇨' },
    { code: '+378', country: 'San Marino', flag: '🇸🇲' },
    { code: '+380', country: 'Ukraine', flag: '🇺🇦' },
    { code: '+381', country: 'Serbia', flag: '🇷🇸' },
    { code: '+382', country: 'Montenegro', flag: '🇲🇪' },
    { code: '+383', country: 'Kosovo', flag: '🇽🇰' },
    { code: '+385', country: 'Croatia', flag: '🇭🇷' },
    { code: '+386', country: 'Slovenia', flag: '🇸🇮' },
    { code: '+387', country: 'Bosnia and Herzegovina', flag: '🇧🇦' },
    { code: '+389', country: 'North Macedonia', flag: '🇲🇰' },
    { code: '+420', country: 'Czech Republic', flag: '🇨🇿' },
    { code: '+421', country: 'Slovakia', flag: '🇸🇰' },
    { code: '+423', country: 'Liechtenstein', flag: '🇱🇮' },
    { code: '+500', country: 'Falkland Islands', flag: '🇫🇰' },
    { code: '+501', country: 'Belize', flag: '🇧🇿' },
    { code: '+502', country: 'Guatemala', flag: '🇬🇹' },
    { code: '+503', country: 'El Salvador', flag: '🇸🇻' },
    { code: '+504', country: 'Honduras', flag: '🇭🇳' },
    { code: '+505', country: 'Nicaragua', flag: '🇳🇮' },
    { code: '+506', country: 'Costa Rica', flag: '🇨🇷' },
    { code: '+507', country: 'Panama', flag: '🇵🇦' },
    { code: '+508', country: 'Saint Pierre and Miquelon', flag: '🇵🇲' },
    { code: '+509', country: 'Haiti', flag: '🇭🇹' },
    { code: '+590', country: 'Guadeloupe', flag: '🇬🇵' },
    { code: '+591', country: 'Bolivia', flag: '🇧🇴' },
    { code: '+592', country: 'Guyana', flag: '🇬🇾' },
    { code: '+593', country: 'Ecuador', flag: '🇪🇨' },
    { code: '+594', country: 'French Guiana', flag: '🇬🇫' },
    { code: '+595', country: 'Paraguay', flag: '🇵🇾' },
    { code: '+596', country: 'Martinique', flag: '🇲🇶' },
    { code: '+597', country: 'Suriname', flag: '🇸🇷' },
    { code: '+598', country: 'Uruguay', flag: '🇺🇾' },
    { code: '+599', country: 'Netherlands Antilles', flag: '🇧🇶' },
    { code: '+670', country: 'East Timor', flag: '🇹🇱' },
    { code: '+672', country: 'Antarctica', flag: '🇦🇶' },
    { code: '+673', country: 'Brunei', flag: '🇧🇳' },
    { code: '+674', country: 'Nauru', flag: '🇳🇷' },
    { code: '+675', country: 'Papua New Guinea', flag: '🇵🇬' },
    { code: '+676', country: 'Tonga', flag: '🇹🇴' },
    { code: '+677', country: 'Solomon Islands', flag: '🇸🇧' },
    { code: '+678', country: 'Vanuatu', flag: '🇻🇺' },
    { code: '+679', country: 'Fiji', flag: '🇫🇯' },
    { code: '+680', country: 'Palau', flag: '🇵🇼' },
    { code: '+681', country: 'Wallis and Futuna', flag: '🇼🇫' },
    { code: '+682', country: 'Cook Islands', flag: '🇨🇰' },
    { code: '+683', country: 'Niue', flag: '🇳🇺' },
    { code: '+684', country: 'American Samoa', flag: '🇦🇸' },
    { code: '+685', country: 'Samoa', flag: '🇼🇸' },
    { code: '+686', country: 'Kiribati', flag: '🇰🇮' },
    { code: '+687', country: 'New Caledonia', flag: '🇳🇨' },
    { code: '+688', country: 'Tuvalu', flag: '🇹🇻' },
    { code: '+689', country: 'French Polynesia', flag: '🇵🇫' },
    { code: '+690', country: 'Tokelau', flag: '🇹🇰' },
    { code: '+691', country: 'Micronesia', flag: '🇫🇲' },
    { code: '+692', country: 'Marshall Islands', flag: '🇲🇭' },
    { code: '+850', country: 'North Korea', flag: '🇰🇵' },
    { code: '+852', country: 'Hong Kong', flag: '🇭🇰' },
    { code: '+853', country: 'Macau', flag: '🇲🇴' },
    { code: '+855', country: 'Cambodia', flag: '🇰🇭' },
    { code: '+856', country: 'Laos', flag: '🇱🇦' },
    { code: '+880', country: 'Bangladesh', flag: '🇧🇩' },
    { code: '+886', country: 'Taiwan', flag: '🇹🇼' },
    { code: '+960', country: 'Maldives', flag: '🇲🇻' },
    { code: '+961', country: 'Lebanon', flag: '🇱🇧' },
    { code: '+962', country: 'Jordan', flag: '🇯🇴' },
    { code: '+963', country: 'Syria', flag: '🇸🇾' },
    { code: '+964', country: 'Iraq', flag: '🇮🇶' },
    { code: '+965', country: 'Kuwait', flag: '🇰🇼' },
    { code: '+966', country: 'Saudi Arabia', flag: '🇸🇦' },
    { code: '+967', country: 'Yemen', flag: '🇾🇪' },
    { code: '+968', country: 'Oman', flag: '🇴🇲' },
    { code: '+970', country: 'Palestine', flag: '🇵🇸' },
    { code: '+971', country: 'United Arab Emirates', flag: '🇦🇪' },
    { code: '+972', country: 'Israel', flag: '🇮🇱' },
    { code: '+973', country: 'Bahrain', flag: '🇧🇭' },
    { code: '+974', country: 'Qatar', flag: '🇶🇦' },
    { code: '+975', country: 'Bhutan', flag: '🇧🇹' },
    { code: '+976', country: 'Mongolia', flag: '🇲🇳' },
    { code: '+977', country: 'Nepal', flag: '🇳🇵' },
    { code: '+992', country: 'Tajikistan', flag: '🇹🇯' },
    { code: '+993', country: 'Turkmenistan', flag: '🇹🇲' },
    { code: '+994', country: 'Azerbaijan', flag: '🇦🇿' },
    { code: '+995', country: 'Georgia', flag: '🇬🇪' },
    { code: '+996', country: 'Kyrgyzstan', flag: '🇰🇬' },
    { code: '+998', country: 'Uzbekistan', flag: '🇺🇿' }
  ];

  const selectedRoom = rooms.find(room => room.id.toString() === bookingData.roomId);

  // Filter nationalities based on search
  const filteredNationalities = nationalities.filter(nationality =>
    nationality.toLowerCase().includes(nationalitySearch.toLowerCase())
  );

  // Filter country codes based on search
  const filteredCountryCodes = countryCodes.filter(country =>
    country.country.toLowerCase().includes(phoneCountryCodeSearch.toLowerCase()) ||
    country.code.includes(phoneCountryCodeSearch)
  );

  // Handle clicks outside dropdown and window events
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (nationalityDropdownRef.current && !nationalityDropdownRef.current.contains(event.target)) {
        setShowNationalityDropdown(false);
      }
      if (phoneCodeDropdownRef.current && !phoneCodeDropdownRef.current.contains(event.target)) {
        setShowPhoneCodeDropdown(false);
      }
    };

    const handleScroll = () => {
      if (showNationalityDropdown) {
        calculateDropdownPosition();
      }
      if (showPhoneCodeDropdown) {
        calculatePhoneCodeDropdownPosition();
      }
    };

    const handleResize = () => {
      if (showNationalityDropdown) {
        calculateDropdownPosition();
      }
      if (showPhoneCodeDropdown) {
        calculatePhoneCodeDropdownPosition();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, [showNationalityDropdown, showPhoneCodeDropdown]);

  const handleInputChange = (field, value) => {
    setBookingData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNationalitySelect = (nationality) => {
    setBookingData(prev => ({
      ...prev,
      nationality: nationality
    }));
    setNationalitySearch(nationality);
    setShowNationalityDropdown(false);
  };

  const calculateDropdownPosition = () => {
    if (nationalityInputRef.current) {
      const rect = nationalityInputRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom,
        left: rect.left,
        width: rect.width
      });
    }
  };

  const handleNationalitySearchChange = (value) => {
    setNationalitySearch(value);
    calculateDropdownPosition();
    setShowNationalityDropdown(true);
    if (value === '') {
      setBookingData(prev => ({
        ...prev,
        nationality: ''
      }));
    }
  };

  const handleNationalityFocus = () => {
    calculateDropdownPosition();
    setShowNationalityDropdown(true);
  };

  const calculatePhoneCodeDropdownPosition = () => {
    if (phoneCodeInputRef.current) {
      const rect = phoneCodeInputRef.current.getBoundingClientRect();
      setPhoneCodeDropdownPosition({
        top: rect.bottom,
        left: rect.left,
        width: rect.width
      });
    }
  };

  const handlePhoneCodeSelect = (countryCode) => {
    setPhoneCountryCode(countryCode);
    setPhoneCountryCodeSearch(countryCode);
    setShowPhoneCodeDropdown(false);
  };

  const handlePhoneCodeSearchChange = (value) => {
    setPhoneCountryCodeSearch(value);
    calculatePhoneCodeDropdownPosition();
    setShowPhoneCodeDropdown(true);
    if (value === '') {
      setPhoneCountryCode('+66');
    }
  };

  const handlePhoneCodeFocus = () => {
    calculatePhoneCodeDropdownPosition();
    setShowPhoneCodeDropdown(true);
  };

  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const calculateTotal = () => {
    if (!selectedRoom || !bookingData.checkIn || !bookingData.checkOut) return 0;
    
    const checkInDate = new Date(bookingData.checkIn);
    const checkOutDate = new Date(bookingData.checkOut);
    const nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
    
    return selectedRoom.price * nights;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the booking data to your backend
    console.log('Booking submitted:', bookingData);
    alert('Booking confirmed! You will receive a confirmation email shortly.');
  };


  const steps = [
    { number: 1, title: 'Room & Dates', description: 'Select your room and dates' },
    { number: 2, title: 'Guest Details', description: 'Enter your information' },
    { number: 3, title: 'Payment', description: 'Choose payment method' },
    { number: 4, title: 'Confirmation', description: 'Review and confirm' }
  ];

  return (
    <PaymentProvider>
      <div className="booking-page">
        <div className="container">
        {/* Header */}
        <div className="page-header">
          <h1 className="page-title">Book Your Stay</h1>
          <p className="page-subtitle">
            Complete your reservation in just a few simple steps
          </p>
        </div>

        <div className="booking-content">
          {/* Progress Steps */}
          <div className="steps-container">
            <div className="steps">
              {steps.map((step) => (
                <div 
                  key={step.number} 
                  className={`step ${currentStep >= step.number ? 'active' : ''} ${currentStep === step.number ? 'current' : ''} ${currentStep > step.number ? 'completed' : ''}`}
                >
                  <div className="step-number">
                    {currentStep > step.number ? (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" fill="currentColor"/>
                      </svg>
                    ) : step.number}
                  </div>
                  <div className="step-info">
                    <div className="step-title">{step.title}</div>
                    <div className="step-description">{step.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Booking Form */}
          <div className="booking-form-container">
            <form onSubmit={handleSubmit} className="booking-form">
              
              {/* Step 1: Room & Dates */}
              {currentStep === 1 && (
                <div className="form-step">
                  {/* Step Header */}
                  {/* <div className="step-header">
                    <h2 className="step-title">Choose Your Perfect Room</h2>
                    <p className="step-description">Select your dates and find the ideal accommodation for your stay</p>
                  </div> */}

                  {/* Search Section */}
                  <div className="search-section">
                    <div className="search-card">
                      <div className="search-header">
                        <h3 className="search-title">
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M3 7V5C3 3.89543 3.89543 3 5 3H19C20.1046 3 21 3.89543 21 5V7M3 7L21 7M3 7V19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19V7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M8 11H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          Search & Filter
                        </h3>
                      </div>
                      
                      <div className="search-form">
                        <div className="search-row horizontal">
                          <div className="search-field">
                            <label className="field-label">
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M8 2V5M16 2V5M3.5 9.09H20.5M21 8.5V17C21 18.1046 20.1046 19 19 19H5C3.89543 19 3 18.1046 3 17V8.5C3 7.39543 3.89543 6.5 5 6.5H19C20.1046 6.5 21 7.39543 21 8.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                              Check-in Date
                            </label>
                            <input 
                              type="date"
                              className="field-input"
                              value={bookingData.checkIn}
                              onChange={(e) => handleInputChange('checkIn', e.target.value)}
                              min={new Date().toISOString().split('T')[0]}
                              required
                            />
                          </div>
                          
                          <div className="search-field">
                            <label className="field-label">
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M8 2V5M16 2V5M3.5 9.09H20.5M21 8.5V17C21 18.1046 20.1046 19 19 19H5C3.89543 19 3 18.1046 3 17V8.5C3 7.39543 3.89543 6.5 5 6.5H19C20.1046 6.5 21 7.39543 21 8.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                              Check-out Date
                            </label>
                            <input 
                              type="date"
                              className="field-input"
                              value={bookingData.checkOut}
                              onChange={(e) => handleInputChange('checkOut', e.target.value)}
                              min={bookingData.checkIn || new Date().toISOString().split('T')[0]}
                              required
                            />
                          </div>
                          
                          <div className="search-field">
                            <label className="field-label">
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M17 21V19C17 17.134 13.866 14 10 14C6.13401 14 3 17.134 3 19V21M10 11C12.2091 11 14 9.20914 14 7C14 4.79086 12.2091 3 10 3C7.79086 3 6 4.79086 6 7C6 9.20914 7.79086 11 10 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                              Guests
                            </label>
                            <select 
                              className="field-select"
                              value={bookingData.guests}
                              onChange={(e) => handleInputChange('guests', parseInt(e.target.value))}
                              required
                            >
                              {[1,2,3,4,5,6,7,8].map(num => (
                                <option key={num} value={num}>{num} {num === 1 ? 'Guest' : 'Guests'}</option>
                              ))}
                            </select>
                          </div>
                          
                          <div className="search-field">
                            <button type="button" className="search-btn" onClick={nextStep}>
                              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M21 21L16.514 16.506L21 21ZM19 10.5C19 15.194 15.194 19 10.5 19C5.806 19 2 15.194 2 10.5C2 5.806 5.806 2 10.5 2C15.194 2 19 5.806 19 10.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Results Section */}
                  <div className="results-section">
                    <div className="results-header">
                      <h3 className="results-title">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M3 7V5C3 3.89543 3.89543 3 5 3H19C20.1046 3 21 3.89543 21 5V7M3 7L21 7M3 7V19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19V7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        Available Rooms ({rooms.length})
                      </h3>
                      <div className="results-summary">
                        {bookingData.checkIn && bookingData.checkOut && (
                          <span className="date-range">
                            {new Date(bookingData.checkIn).toLocaleDateString()} - {new Date(bookingData.checkOut).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="rooms-grid vertical">
                      {loading ? (
                        <div className="loading-state">
                          <div className="loading-spinner"></div>
                          <p>Loading rooms...</p>
                        </div>
                      ) : error ? (
                        <div className="error-state">
                          <p>❌ {error} | Status: Backend API not responding</p>
                        </div>
                      ) : (
                        rooms.map(room => (
                          <RoomRow
                            key={room.id}
                            room={room}
                            isSelected={bookingData.roomId === room.id.toString()}
                            onSelect={(selectedRoom) => handleInputChange('roomId', selectedRoom.id.toString())}
                            showSelectButton={true}
                          />
                        ))
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Guest Details */}
              {currentStep === 2 && (
                <div className="form-step">
                  <h2 className="step-title">Guest Information</h2>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">First Name</label>
                      <input 
                        type="text"
                        className="form-input"
                        value={bookingData.firstName}
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                        placeholder="Johnson"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Last Name</label>
                      <input 
                        type="text"
                        className="form-input"
                        value={bookingData.lastName}
                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                        placeholder="Dep"
                        required
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Email Address</label>
                      <input 
                        type="email"
                        className="form-input"
                        value={bookingData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        placeholder="Johnson.dep@example.com"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Phone Number</label>
                      <div className="phone-input-container">
                        <div className="phone-code-dropdown-container" ref={phoneCodeDropdownRef}>
                          <input 
                            ref={phoneCodeInputRef}
                            type="text"
                            className="phone-code-input"
                            value={phoneCountryCodeSearch}
                            onChange={(e) => handlePhoneCodeSearchChange(e.target.value)}
                            onFocus={handlePhoneCodeFocus}
                            placeholder="+66"
                            autoComplete="off"
                            required
                          />
                          {showPhoneCodeDropdown && (
                            <div 
                              className="phone-code-dropdown"
                              style={{
                                position: 'fixed',
                                top: `${phoneCodeDropdownPosition.top}px`,
                                left: `${phoneCodeDropdownPosition.left}px`,
                                width: `${phoneCodeDropdownPosition.width}px`,
                                zIndex: 9999
                              }}
                            >
                              {filteredCountryCodes.length > 0 ? (
                                filteredCountryCodes.map(country => (
                                  <div 
                                    key={`${country.code}-${country.country}`}
                                    className="phone-code-option"
                                    onClick={() => handlePhoneCodeSelect(country.code)}
                                  >
                                    <span className="phone-code-flag">{country.flag}</span>
                                    <span className="phone-code-text">{country.code}</span>
                                  </div>
                                ))
                              ) : (
                                <div className="phone-code-option no-results">
                                  No country codes found
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                        <input 
                          type="tel"
                          className="phone-number-input"
                          value={bookingData.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          placeholder="0912345678"
                          autoComplete="off"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Nationality</label>
                    <div className="nationality-dropdown-container" ref={nationalityDropdownRef}>
                      <input 
                        ref={nationalityInputRef}
                        type="text"
                        className="form-input"
                        value={nationalitySearch}
                        onChange={(e) => handleNationalitySearchChange(e.target.value)}
                        onFocus={handleNationalityFocus}
                        placeholder="Search or select your nationality"
                        required
                      />
                    </div>
                    {showNationalityDropdown && (
                      <div 
                        className="nationality-dropdown"
                        style={{
                          position: 'fixed',
                          top: `${dropdownPosition.top}px`,
                          left: `${dropdownPosition.left}px`,
                          width: `${dropdownPosition.width}px`,
                          zIndex: 9999
                        }}
                      >
                        {filteredNationalities.length > 0 ? (
                          filteredNationalities.map(nationality => (
                            <div 
                              key={nationality}
                              className="nationality-option"
                              onClick={() => handleNationalitySelect(nationality)}
                            >
                              {nationality}
                            </div>
                          ))
                        ) : (
                          <div className="nationality-option no-results">
                            No nationalities found
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Step 3: Payment */}
              {currentStep === 3 && (
                <div className="form-step">
                  <QRPaymentStep 
                    amount={calculateTotal()}
                    onPaymentComplete={(paymentData) => {
                      console.log('Payment completed:', paymentData);
                    }}
                    onNext={nextStep}
                    onPrevious={prevStep}
                  />
                </div>
              )}

              {/* Step 4: Confirmation */}
              {currentStep === 4 && (
                <div className="form-step">
                  <h2 className="step-title">Review & Confirm</h2>
                  
                  <div className="booking-summary">
                    <div className="summary-section">
                      <h3>Room Details</h3>
                      <p><strong>Room:</strong> {selectedRoom?.name}</p>
                      <p><strong>Type:</strong> {selectedRoom?.type}</p>
                      <p><strong>Check-in:</strong> {bookingData.checkIn}</p>
                      <p><strong>Check-out:</strong> {bookingData.checkOut}</p>
                      <p><strong>Guests:</strong> {bookingData.guests}</p>
                    </div>

                    <div className="summary-section">
                      <h3>Guest Information</h3>
                      <p><strong>Name:</strong> {bookingData.firstName} {bookingData.lastName}</p>
                      <p><strong>Email:</strong> {bookingData.email}</p>
                      <p><strong>Phone:</strong> {bookingData.phone}</p>
                      <p><strong>Nationality:</strong> {bookingData.nationality}</p>
                    </div>

                    <div className="summary-section">
                      <h3>Payment Summary</h3>
                      <div className="price-breakdown">
                        <div className="price-line">
                          <span>Room Rate (฿{selectedRoom?.price}/night)</span>
                          <span>฿{calculateTotal()}</span>
                        </div>
                        <div className="price-line total">
                          <span><strong>Total Amount</strong></span>
                          <span><strong>฿{calculateTotal()}</strong></span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Special Requests (Optional)</label>
                    <textarea 
                      className="form-textarea"
                      value={bookingData.specialRequests}
                      onChange={(e) => handleInputChange('specialRequests', e.target.value)}
                      placeholder="Any special requests or notes..."
                    />
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="form-navigation">
                {currentStep > 1 && (
                  <button 
                    type="button" 
                    className="btn btn-secondary"
                    onClick={prevStep}
                  >
                    Previous
                  </button>
                )}
                
                {currentStep < 4 ? (
                  <button 
                    type="button" 
                    className="btn btn-primary"
                    onClick={nextStep}
                  >
                    Next Step
                  </button>
                ) : (
                  <button 
                    type="submit" 
                    className="btn btn-primary"
                  >
                    Confirm Booking
                  </button>
                )}
              </div>
            </form>
          </div>
          </div>
        </div>
      </div>
    </PaymentProvider>
  );
};

export default Booking;
