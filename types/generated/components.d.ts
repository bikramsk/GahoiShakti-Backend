import type { Schema, Struct } from '@strapi/strapi';

export interface LayoutAdditionalDetails extends Struct.ComponentSchema {
  collectionName: 'components_layout_additional_details';
  info: {
    description: '';
    displayName: 'Additional Details';
  };
  attributes: {
    blood_group: Schema.Attribute.String;
    current_address: Schema.Attribute.Text;
    date_of_birth: Schema.Attribute.Date;
    date_of_marriage: Schema.Attribute.Date;
    higher_education: Schema.Attribute.String;
    regional_information: Schema.Attribute.Component<
      'layout.regional-information',
      false
    >;
  };
}

export interface LayoutBiographicalDetails extends Struct.ComponentSchema {
  collectionName: 'components_layout_biographical_details';
  info: {
    description: '';
    displayName: 'Biographical Details';
  };
  attributes: {
    Aakna: Schema.Attribute.Enumeration<
      [
        'Amroha',
        'Andhi',
        'Asoo',
        'Asoopi',
        'Asooti',
        'Asudipa',
        'Amar',
        'Arusiya',
        'Badal/Waghil/Bandal',
        'Badil',
        'Baderiya',
        'Badhiya',
        'Badonya',
        'Bagar',
        'Bahre',
        'Bajrang Gadiya',
        'Bamoriya',
        'Bardiya',
        'Barele/Barol',
        'Barha/Barehe',
        'Baronya',
        'Barsainya',
        'Baidal',
        'Beder',
        'Behre',
        'Beder/Badil/Baidal',
        'Bed',
        'Bhagoriya',
        'Bhondu',
        'Bilaiya',
        'Binaurya',
        'Bijpuriya',
        'Brijpuriya',
        'Changele',
        'Chandaiya',
        'Chapra/Chupara',
        'Chauda/Chodha/Chouda',
        'Chiroliya',
        'Dagarhiha',
        'Dadam',
        'Dadarya',
        'Damele',
        'Damorha',
        'Dangre',
        'Dangan ke',
        'Deepa/Teepa',
        'Devadhiya',
        'Dhanoriya',
        'Dhoosar',
        'Digoriya',
        'Dingauriya',
        'Dohariya Devaraha',
        'Gandhi',
        'Geda',
        'Ghura',
        'Gol',
        'Gugoriya/Ugoriya',
        'Gangal/Gagil',
        'Hadyal',
        'Hathnoria/Hathnotiya',
        'Hunka',
        'Indurkhiya',
        'Itodiya',
        'Itoriya',
        'Iksade',
        'Jaar',
        'Jakonya',
        'Jalaounya',
        'Jauriya',
        'Jhudele/Kshurele',
        'Jhuke/Jhunk',
        'Joliya',
        'Jugoriya',
        'Jaital',
        'Kachhil',
        'Kajar',
        'Kanjoulya',
        'Kanthariya',
        'Kasav',
        'Kasiv',
        'Kastwar',
        'Kathal/Kathil',
        'Kathori/Karoli ke',
        'Khangat',
        'Khard',
        'Khadsariya/Kharsadiya',
        'Khaira',
        'Khantal',
        'Kharaya',
        'Kocchal/Kochil',
        'Kudraya',
        'Kurele',
        'Kuretiya/Kuraithiya',
        'Kurothiya',
        'Kshankshar',
        'Lahariya',
        'Lakhatkiya',
        'Lohiya/Loiya',
        'Mahtele',
        'Mangole',
        'Mar',
        'Matele',
        'Maunya',
        'Misurha/Masaurya',
        'Mor',
        'Mungele',
        'Nachhola',
        'Nagariya',
        'Nahar',
        'Naar',
        'Naina/Nehna',
        'Neekhra',
        'Nigoti/Nigotiya',
        'Nignotiya',
        'Nisunge/Nisuri',
        'Nogaraiya',
        'Nolha/Nilha',
        'Pachnole/Pachraulya',
        'Pahariya',
        'Paharu',
        'Patodiya',
        'Patodi',
        'Patraiya/Paterha',
        'Patwari',
        'Piparsaniya',
        'Piparsania',
        'Purpuriya/Puranpuriya',
        'Raghare',
        'Rawat',
        'Reja',
        'Rikholya/Lakhourya',
        'Rusiya',
        'Saab/Sahu',
        'Sadele',
        'Sah/Saav',
        'Sahdele',
        'Sakeray/Sakahere',
        'Sarawagi',
        'Sarawgi (Mau ke)',
        'Sawla/Saula/Chawla',
        'Seth',
        'Seth (Bareth ke)',
        'Seth (Chandaiya ke)',
        'Seth (Kathori/Karoli ke)',
        'Seth (Mau ke/Paliya ke/Khakshis ke/Mahuta ke/Bhaghoi ke)',
        'Seth (Nawgaon/Negua ke)',
        'Seth (Nolha ke)',
        'Seth (Padri ke)',
        'Seth (Rora ke)',
        'Shaav/Shah (Unnao ke)',
        'Shikoly/Sokorya/Shipoulya',
        'Sijariya',
        'Sirsoniya/Risoniya',
        'Soni',
        'Sudipa',
        'Suhane/Sohane',
        'Sulganiya/Sulghaniya',
        'Tapa',
        'Tarsolliya',
        'Tikraya/Tapakle',
        'Trisolliya',
        'Tudha',
        'Tusele',
        'Vachhil',
        'Vilaiya',
        'Viswari',
        'Vasar/Vastil/Vasal',
        'Wageriya',
        'KareKhemau',
        'Sethiya',
        'Dhusar',
        'Jhanjhar',
        'Baraya',
        'Kunayar',
        'Chungele',
        'Bhagorya',
        'Dhingauriya',
        'Dengre/Dangre',
        'Mihi ke Kunwar',
        'Kharya/Khairya',
        'Baderia',
        'Sirojiya',
        'Kuchiya/Kuchha',
        'Kanakne',
        'Matele/Mahtele',
        'Itoriya/Itodiya',
        'Vinaurya',
        'Shikolya/Sakoraya/Shipolya',
        'Katare',
        'Amaulya/Amauriya',
        'Jhudele/Jhad',
        'Bhondiya/Bhondu',
        'Teetbilasi/Teetbirasi',
        'Chandaiya/Chandraseniya',
        'Jhudele/Jurele/Jhood',
        'Kandele',
        'Others',
      ]
    >;
    Gotra: Schema.Attribute.Enumeration<
      [
        'Vasar/Vastil/Vasal',
        'Gol',
        'Gangal / Gagil',
        'Badal / Waghil / Bandal',
        'Kocchal / Kochil',
        'Jaital',
        'Vachhil',
        'Kachhil',
        'Bhaal',
        'Kohil',
        'Kasiv',
        'Kasav',
        'Single',
        'Others',
      ]
    >;
    Grah: Schema.Attribute.Enumeration<['', 'Devta', 'Manushya', 'Rakshasa']>;
    Handicap: Schema.Attribute.Enumeration<
      ['', 'None', 'Physically', 'Mentally', 'Other']
    >;
    is_married: Schema.Attribute.Enumeration<['', 'Married', 'Unmarried']>;
    Mama_Aakna: Schema.Attribute.Enumeration<
      [
        'Aasu',
        'Amar',
        'Amolya',
        'Amoriya',
        'Andhi',
        'Baderiya',
        'Badonya',
        'Bajrangdiya',
        'Bedar',
      ]
    >;
    manglik_status: Schema.Attribute.Enumeration<
      ['', 'Manglik', 'Non Manglik', 'Aanshik', 'Other']
    >;
    marriage_to_another_caste: Schema.Attribute.Enumeration<
      ['', 'Married to Another Caste', 'Same Caste Marriage']
    >;
  };
}

export interface LayoutChildDetails extends Struct.ComponentSchema {
  collectionName: 'components_layout_child_details';
  info: {
    description: '';
    displayName: 'Child Details';
  };
  attributes: {
    child_name: Schema.Attribute.String;
    gender: Schema.Attribute.Enumeration<['Male', 'Female']>;
    phone_number: Schema.Attribute.String;
  };
}

export interface LayoutDonations extends Struct.ComponentSchema {
  collectionName: 'components_layout_donations';
  info: {
    description: '';
    displayName: 'donations';
  };
  attributes: {
    Amount: Schema.Attribute.BigInteger;
    Date: Schema.Attribute.Date;
    Name: Schema.Attribute.String;
    place: Schema.Attribute.String;
    purpose: Schema.Attribute.String;
  };
}

export interface LayoutFamilyDetails extends Struct.ComponentSchema {
  collectionName: 'components_layout_family_details';
  info: {
    description: '';
    displayName: 'Family Details';
  };
  attributes: {
    aakna: Schema.Attribute.String;
    father_mobile: Schema.Attribute.String;
    father_name: Schema.Attribute.String;
    gotra: Schema.Attribute.String;
    mother_mobile: Schema.Attribute.String;
    mother_name: Schema.Attribute.String;
    phone_number: Schema.Attribute.BigInteger;
    siblingDetails: Schema.Attribute.Component<'layout.sibling-details', true>;
    spouse_mobile: Schema.Attribute.String;
    spouse_name: Schema.Attribute.String;
  };
}

export interface LayoutLocalizedRichText extends Struct.ComponentSchema {
  collectionName: 'components_layout_localized_rich_texts';
  info: {
    displayName: 'Localized Rich Text';
  };
  attributes: {
    en: Schema.Attribute.Blocks;
    hi: Schema.Attribute.Blocks;
  };
}

export interface LayoutLocalizedText extends Struct.ComponentSchema {
  collectionName: 'components_layout_localized_texts';
  info: {
    displayName: 'Localized Text';
  };
  attributes: {
    en: Schema.Attribute.String;
    hi: Schema.Attribute.String;
  };
}

export interface LayoutMonthlyExpenses extends Struct.ComponentSchema {
  collectionName: 'components_layout_monthly_expenses';
  info: {
    description: '';
    displayName: 'monthlyExpenses';
  };
  attributes: {
    feed: Schema.Attribute.BigInteger;
    maintenance: Schema.Attribute.BigInteger;
    medical: Schema.Attribute.BigInteger;
    Month: Schema.Attribute.String;
    staff: Schema.Attribute.BigInteger;
    total: Schema.Attribute.BigInteger;
  };
}

export interface LayoutPersonalInformation extends Struct.ComponentSchema {
  collectionName: 'components_layout_personal_informations';
  info: {
    description: '';
    displayName: 'Personal Information';
  };
  attributes: {
    display_picture: Schema.Attribute.Media<'images'>;
    email_address: Schema.Attribute.Email & Schema.Attribute.Required;
    full_name: Schema.Attribute.String;
    Gender: Schema.Attribute.Enumeration<['Male', 'Female']> &
      Schema.Attribute.Required;
    is_gahoi: Schema.Attribute.Enumeration<['Yes', 'No']> &
      Schema.Attribute.Required;
    mobile_number: Schema.Attribute.BigInteger &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMax<
        {
          max: '10';
        },
        string
      >;
    nationality: Schema.Attribute.Enumeration<['Indian', 'Non-Indian']>;
    village: Schema.Attribute.String;
  };
}

export interface LayoutRegionalInformation extends Struct.ComponentSchema {
  collectionName: 'components_layout_regional_informations';
  info: {
    description: '';
    displayName: 'Regional Information';
  };
  attributes: {
    LocalPanchayat: Schema.Attribute.Enumeration<
      [
        '',
        'Gwalior',
        'Bhind',
        'Datia',
        'Morena',
        'Jaipur',
        'Jalaun',
        'Lucknow',
        'Kanpur',
        'Karvi',
        'Banda',
        'Auraiya',
        'Jhansi',
        'Tikamgarh',
        'Lalitpur',
        'Ghasan',
        'Shivpuri',
        'Ashoknagar',
        'Guna',
        'Ahmedabad',
        'Indore',
        'Ujjain',
        'Bhopal',
        'Vidisha',
        'Raisen',
        'Narsinghpur',
        'Jabalpur',
        'Umariya',
        'Sagar',
        'Seoni',
        'Katni',
        'Chhindwara',
        'Panna',
        'Hoshangabad',
        'Mandla',
        'Hata',
        'Shahdol',
        'Dindori',
        'Sultanpur',
        'Chhatarpur',
        'Satna',
        'Patna City',
        'Mahoba',
        'Rewa',
        'Durg',
        'Rajnandgaon',
        'Dhamtari',
        'Raipur',
        'Bilaspur',
        'Jagdalpur',
        'Baikunthpur',
        'Nagpur',
        'Dhuliya',
        'Pune',
        'Chalisgaon',
        'Amravati',
        'Mumbai',
        'Other',
        'Mathura',
        'Delhi',
      ]
    >;
    LocalPanchayatName: Schema.Attribute.Enumeration<
      [
        '',
        'Gahoi Vaishya Samaj Register Brahttar Gwalior',
        'Gahoi Vaishya Panchayat',
        'Gahoi Vaishya Sabha',
        'Gahoi Seva Mandal',
        'Gahoi Vaishya Seva Samiti',
        'Gahoi Vaishya Samaj',
        'Gahoi Vaishya Samaj Panchayat',
        'Gahoi Vaishya Panchayat Samiti',
        'Gahoi Vaishya Kalyan Samiti',
        'Gahoi Vaishya Yuva Samiti',
        'Shri Gahoi Vaishya Panchayat',
        'Shri Gahoi Vaishya Seva Samiti',
        'Shri Daudayal Gahoi Vaishya Seva Samiti',
        'Gahoi Vaishya Samaj Kalyan Samiti',
        'Gahoi Vaishya Panchayat Parishad',
        'Shri Gahoi Vaishya Samaj Panchayat',
        'Shri Gahoi Vaishya Sabha',
        'Shri Gahoi Vaishya Samaj',
        'Gahoi Vaishya Vikas Sansthan',
        'Shri Gahoi Vaishya Association',
      ]
    >;
    RegionalAssembly: Schema.Attribute.Enumeration<
      [
        '',
        'Chambal Regional Assembly',
        'Ganga Jamuna Regional Assembly',
        'Bundelkhand Regional Assembly',
        'Chaurasi Regional Assembly',
        'Central Malwa Regional Assembly',
        'Mahakaushal Regional Assembly',
        'Vindhya Regional Assembly',
        'Chhattisgarh Regional Assembly',
        'Southern Regional Assembly',
        'Northern Regional Assembly',
      ]
    >;
    State: Schema.Attribute.Enumeration<
      [
        '',
        'Bihar',
        'Chhatisgarh',
        'Delhi',
        'Gujarat',
        'Madhya Pradesh',
        'Maharashtra',
        'Rajasthan',
        'Uttar Pradesh',
      ]
    >;
    SubLocalPanchayat: Schema.Attribute.Enumeration<
      [
        '',
        'Gwalior',
        'Madhavganj',
        'Khasgi Bazaar',
        'Daulatganj',
        'Kampoo',
        'Lohia Bazaar',
        'Phalka Bazaar',
        'Lohamandi',
        'Bahodapur',
        'Naka Chandravadni',
        'Harishankarpuram',
        'Thatipur',
        'Morar',
        'Dabra',
        'Pichhore Dabra',
        'Behat',
        'Alampur',
        'Daboh',
        'Tharet',
        'Mihona',
        'Aswar',
        'Lahar',
        'Gohad',
        'Machhand',
        'Raun',
        'Bhind',
        'Sewdha',
        'Chhoti Badoni',
        'Datia',
        'Indergarh',
        'Badhara Sopan',
        'Unnao Balaji',
        'Bhander',
        'Salon B',
        'Morena',
        'Jaipur',
        'Orai',
        'Konch',
        'Madhogarh',
        'Jalaun',
        'Lucknow',
        'Kanpur',
        'Karvi',
        'Banda',
        'Auraiya',
        'Garotha',
        'Barua Sagar',
        'Simriddha',
        'Tahrauli',
        'Gursarai',
        'Bamore',
        'Poonch',
        'Erich',
        'BHEL Simrawali',
        'Babina Cantt',
        'Bangra Uldan Ranipur',
        'Mau Ranipur',
        'Bada Gaon',
        'Moth',
        'Ranipur',
        'Raksha',
        'Jhansi',
        'Samthar',
        'Archra',
        'Shaktibairo',
        'Niwari',
        'Jeron',
        'Prithvipur',
        'Simra',
        'Manjna',
        'Taricharkala',
        'Tikamgarh',
        'Talbehat',
        'Bansi',
        'Lalitpur',
        'Purakala',
        'Narahat',
        'Vangua Kala',
        'War',
        'Shivpuri',
        'Malhawani',
        'Pipara',
        'Semri',
        'Bamore Damaroun',
        'Manpura',
        'Karera',
        'Bhonti',
        'Ashoknagar',
        'Bamore Kala',
        'Dinara',
        'Guna',
        'Gandhinagar',
        'Indore',
        'Ujjain',
        'Bhopal',
        'Vidisha',
        'Bairasia',
        'Begumganj',
        'Gote Gaon',
        'Gadarwara',
        'Barheta Narsinghpur',
        'Narsinghpur',
        'Kareli',
        'Paloha',
        'Tendu Kheda',
        'Bedu',
        'Mugawani',
        'Chichli',
        'Sai Kheda',
        'Jabalpur',
        'Khitola',
        'Sihora',
        'Machhgawan',
        'Silaudi',
        'Masur Pani',
        'Dhuldhuli',
        'Deori',
        'Rehli',
        'Sagar',
        'Gadhakota',
        'Deori Kalan',
        'Shahgarh',
        'Ganesh Ganj',
        'Seoni',
        'Kanhwara',
        'Katni',
        'Junnardev',
        'Chhindwara',
        'Shahnagar',
        'Pawai',
        'Krishnagarh',
        'Pipariya',
        'Mandla',
        'Madhiya Do',
        'Shahdol',
        'Dindori',
        'Raghavgarh',
        'Visani',
        'Bameetha',
        'Chhatarpur',
        'Maharajpur',
        'Naugaon',
        'Bijawar',
        'Chandra Nagar',
        'Gulgaj',
        'Bakswaha',
        'Gadhi Malhara',
        'Lavkush Nagar',
        'Alipur',
        'Tatam',
        'Harpalpur',
        'Ishanagar',
        'Bada Malhara',
        'Amanagar',
        'Panna',
        'Ajaigarh',
        'Gunnor',
        'Mohendra',
        'Simariya',
        'Sunwani Kala',
        'Kishangarh',
        'Satna',
        'Nayagaon Chitrakoot',
        'Patna City',
        'Mahoba',
        'Rewa',
        'Durg',
        'Rajnandgaon',
        'Dhamtari',
        'Raipur',
        'Bilaspur',
        'Jagdalpur',
        'Baikunthpur',
        'Nagpur',
        'Dhuliya',
        'Pune',
        'Chalisgaon',
        'Amravati',
        'Mumbai',
        'Other',
        'Mathura',
        'Delhi',
      ]
    >;
  };
}

export interface LayoutSevaPlaces extends Struct.ComponentSchema {
  collectionName: 'components_layout_seva_places';
  info: {
    description: '';
    displayName: 'sevaPlaces';
  };
  attributes: {
    address: Schema.Attribute.Text;
    contact: Schema.Attribute.String;
    image: Schema.Attribute.Media<'images'>;
    inCharge: Schema.Attribute.String;
    name: Schema.Attribute.String;
    url: Schema.Attribute.Text;
  };
}

export interface LayoutSiblingDetails extends Struct.ComponentSchema {
  collectionName: 'components_layout_sibling_details';
  info: {
    description: '';
    displayName: 'sibling-details';
  };
  attributes: {
    age: Schema.Attribute.Integer;
    education: Schema.Attribute.Enumeration<
      [
        'Primary',
        'Secondary',
        'Higher Secondary',
        'Graduate',
        'Post Graduate',
        'Other',
      ]
    >;
    gender: Schema.Attribute.Enumeration<['Male', 'Female']>;
    is_dependent: Schema.Attribute.Boolean;
    marital_status: Schema.Attribute.Enumeration<['Married', 'Unmarried']>;
    occupation: Schema.Attribute.Enumeration<
      ['Student', 'Employed', 'Self-Employed', 'Business', 'Homemaker', 'Other']
    >;
    phone_number: Schema.Attribute.String;
    sibling_name: Schema.Attribute.String;
    sibling_relation: Schema.Attribute.Enumeration<
      [
        "Father's (Elder) Brother \u0924\u093E\u090A",
        "Father's (Younger) Brother \u091A\u093E\u091A\u093E",
        "Father's Sister \u092C\u0941\u0906",
        "Mother's Brother \u092E\u093E\u092E\u093E",
        "Mother's Sister \u092E\u094C\u0938\u0940",
        'Sister \u092C\u0939\u0928',
        'Brother \u092D\u093E\u0908',
      ]
    >;
  };
}

export interface LayoutWorkInformation extends Struct.ComponentSchema {
  collectionName: 'components_layout_work_informations';
  info: {
    description: '';
    displayName: 'Work Information';
  };
  attributes: {
    businessSize: Schema.Attribute.Enumeration<
      [
        '',
        'Micro Enterprise',
        'Small Enterprise',
        'Medium Enterprise',
        'Large Enterprise',
        'Self Employed/Freelancer',
        'Not Applicable',
      ]
    > &
      Schema.Attribute.Required;
    businessType: Schema.Attribute.Enumeration<
      [
        '',
        'Sole Proprietorship',
        'Partnership',
        'Private Limited Company',
        'Public Limited Company',
        'Limited Liability Partnership (LLP)',
        'Other',
      ]
    >;
    businessYears: Schema.Attribute.Enumeration<
      [
        '',
        '0-2 years',
        '3-5 years',
        '6-10 years',
        '11-20 years',
        'More than 20 years',
      ]
    >;
    company_name: Schema.Attribute.String;
    employmentType: Schema.Attribute.Enumeration<
      [
        '',
        'Full-time',
        'Part-time',
        'Contract',
        'Self-employed',
        'Business Owner',
        'Not Currently Employed',
      ]
    > &
      Schema.Attribute.Required;
    industrySector: Schema.Attribute.Enumeration<
      [
        '',
        'Agriculture & Allied Activities',
        'Manufacturing',
        'Construction & Real Estate',
        'Trade & Commerce',
        'Transportation & Logistics',
        'Information Technology & Services',
        'Financial Services',
        'Healthcare & Pharmaceuticals',
        'Education & Training',
        'Professional Services',
        'Hospitality & Tourism',
        'Media & Entertainment',
        'Textile & Apparel',
        'Mining & Minerals',
        'Power & Energy',
        'Other Services',
      ]
    > &
      Schema.Attribute.Required;
    occupation: Schema.Attribute.String;
    work_area: Schema.Attribute.String;
    workType: Schema.Attribute.Enumeration<
      [
        '',
        'Business Owner',
        'Professional',
        'Skilled Worker',
        'Government Service',
        'Private Sector Employee',
        'Freelancer/Consultant',
        'Retired',
        'Other',
      ]
    > &
      Schema.Attribute.Required;
  };
}

export interface LayoutYourSuggestion extends Struct.ComponentSchema {
  collectionName: 'components_layout_your_suggestions';
  info: {
    description: '';
    displayName: 'Your Suggestion';
  };
  attributes: {
    suggestions: Schema.Attribute.Text;
  };
}

export interface SharedMedia extends Struct.ComponentSchema {
  collectionName: 'components_shared_media';
  info: {
    displayName: 'Media';
    icon: 'file-video';
  };
  attributes: {
    file: Schema.Attribute.Media<'images' | 'files' | 'videos'>;
  };
}

export interface SharedQuote extends Struct.ComponentSchema {
  collectionName: 'components_shared_quotes';
  info: {
    displayName: 'Quote';
    icon: 'indent';
  };
  attributes: {
    body: Schema.Attribute.Text;
    title: Schema.Attribute.String;
  };
}

export interface SharedRichText extends Struct.ComponentSchema {
  collectionName: 'components_shared_rich_texts';
  info: {
    description: '';
    displayName: 'Rich text';
    icon: 'align-justify';
  };
  attributes: {
    body: Schema.Attribute.RichText;
  };
}

export interface SharedSeo extends Struct.ComponentSchema {
  collectionName: 'components_shared_seos';
  info: {
    description: '';
    displayName: 'Seo';
    icon: 'allergies';
    name: 'Seo';
  };
  attributes: {
    metaDescription: Schema.Attribute.Text & Schema.Attribute.Required;
    metaTitle: Schema.Attribute.String & Schema.Attribute.Required;
    shareImage: Schema.Attribute.Media<'images'>;
  };
}

export interface SharedSlider extends Struct.ComponentSchema {
  collectionName: 'components_shared_sliders';
  info: {
    description: '';
    displayName: 'Slider';
    icon: 'address-book';
  };
  attributes: {
    files: Schema.Attribute.Media<'images', true>;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'layout.additional-details': LayoutAdditionalDetails;
      'layout.biographical-details': LayoutBiographicalDetails;
      'layout.child-details': LayoutChildDetails;
      'layout.donations': LayoutDonations;
      'layout.family-details': LayoutFamilyDetails;
      'layout.localized-rich-text': LayoutLocalizedRichText;
      'layout.localized-text': LayoutLocalizedText;
      'layout.monthly-expenses': LayoutMonthlyExpenses;
      'layout.personal-information': LayoutPersonalInformation;
      'layout.regional-information': LayoutRegionalInformation;
      'layout.seva-places': LayoutSevaPlaces;
      'layout.sibling-details': LayoutSiblingDetails;
      'layout.work-information': LayoutWorkInformation;
      'layout.your-suggestion': LayoutYourSuggestion;
      'shared.media': SharedMedia;
      'shared.quote': SharedQuote;
      'shared.rich-text': SharedRichText;
      'shared.seo': SharedSeo;
      'shared.slider': SharedSlider;
    }
  }
}
