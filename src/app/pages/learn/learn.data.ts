export interface Course {
    id: string;
    title: string;
    vendor: string;
    vendorLogo: string;
    category: string;
    description: string;
    region: string;
    date: string;
    deliveryMode: string[];
    technology: string[];
    bannerGradient: string;
}

export const MOCK_COURSES: Course[] = [
    {
        id: '1',
        title: 'Advanced Cloud Security Architecture',
        vendor: 'Microsoft',
        vendorLogo: 'https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg',
        category: 'Cloud Security',
        description: 'Master the principles of designing secure cloud environments using Azure security services.',
        region: 'Global',
        date: 'March 15, 2026',
        deliveryMode: ['Online', 'Self-paced'],
        technology: ['Azure', 'Cloud'],
        bannerGradient: 'from-blue-600 to-indigo-700'
    },
    {
        id: '2',
        title: 'Zero Trust Network Access Implementation',
        vendor: 'Zscaler',
        vendorLogo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/Zscaler_logo.svg/1050px-Zscaler_logo.svg.png',
        category: 'Network Security',
        description: 'Learn how to implement a Zero Trust architecture to protect resources across your enterprise.',
        region: 'EMEA',
        date: 'April 2, 2026',
        deliveryMode: ['Instructor-led'],
        technology: ['Zscaler', 'Zero Trust'],
        bannerGradient: 'from-teal-500 to-emerald-700'
    },
    {
        id: '3',
        title: 'Next-Generation Firewall (NGFW) Expert',
        vendor: 'Palo Alto Networks',
        vendorLogo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Palo_Alto_Networks_logo.svg/1200px-Palo_Alto_Networks_logo.svg.png',
        category: 'Firewall',
        description: 'Deep dive into Palo Alto Networks NGFW configuration, management, and troubleshooting.',
        region: 'AMER',
        date: 'May 10, 2026',
        deliveryMode: ['Online', 'Classroom'],
        technology: ['Palo Alto', 'Firewall'],
        bannerGradient: 'from-orange-500 to-red-700'
    },
    {
        id: '4',
        title: 'Endpoint Detection & Response (EDR) Mastery',
        vendor: 'CrowdStrike',
        vendorLogo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/CrowdStrike_Logo.svg/1280px-CrowdStrike_Logo.svg.png',
        category: 'Endpoint Security',
        description: 'Advanced threat hunting and incident response using the CrowdStrike Falcon platform.',
        region: 'APAC',
        date: 'June 20, 2026',
        deliveryMode: ['Online'],
        technology: ['CrowdStrike', 'EDR'],
        bannerGradient: 'from-red-600 to-rose-800'
    },
    {
        id: '5',
        title: 'SOAR Automation and Orchestration',
        vendor: 'Splunk',
        vendorLogo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Splunk_logo.svg/1200px-Splunk_logo.svg.png',
        category: 'SIEM/SOAR',
        description: 'Streamline security operations by automating incident response workflows in Splunk Phantom.',
        region: 'Global',
        date: 'July 5, 2026',
        deliveryMode: ['Self-paced'],
        technology: ['Splunk', 'SOAR'],
        bannerGradient: 'from-black to-slate-800'
    },
    {
        id: '6',
        title: 'Identity and Access Management Strategy',
        vendor: 'Okta',
        vendorLogo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/af/Okta_logo.svg/1200px-Okta_logo.svg.png',
        category: 'IAM',
        description: 'Design robust IAM strategies to secure user identities and control access to applications.',
        region: 'Global',
        date: 'August 12, 2026',
        deliveryMode: ['Online', 'Instructor-led'],
        technology: ['Okta', 'IAM'],
        bannerGradient: 'from-blue-500 to-sky-700'
    }
];
