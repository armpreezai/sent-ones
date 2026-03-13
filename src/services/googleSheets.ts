import Papa from 'papaparse';

export interface UpcomingItem {
  location: 'Boksburg' | 'Benoni';
  category: 'Speaker' | 'Events';
  title: string;
  subtitle: string;
  description: string;
  date: string;
  imageUrl?: string;
}

export const fetchUpcomingData = async (): Promise<UpcomingItem[]> => {
  try {
    const response = await fetch('/api/upcoming-data');
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.details || errorData.error || `Backend returned ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!Array.isArray(data)) return [];

    return data.map((row: any) => {
      const getValue = (keyName: string) => {
        const key = Object.keys(row).find(k => k.toLowerCase().includes(keyName.toLowerCase()));
        return key ? row[key] : '';
      };

      const rawLoc = (getValue('Location') || '').toString().trim().toLowerCase();
      const rawCat = (getValue('Category') || '').toString().trim().toLowerCase();
      
      return {
        location: (rawLoc.includes('boksburg') ? 'Boksburg' : 'Benoni') as 'Boksburg' | 'Benoni',
        category: (rawCat.includes('speaker') ? 'Speaker' : 'Events') as 'Speaker' | 'Events',
        title: getValue('Title') || '',
        subtitle: getValue('Subtitle') || '',
        description: getValue('Description') || '',
        date: getValue('Date') || '',
        imageUrl: getValue('ImageURL') || '',
      };
    });
  } catch (error) {
    console.error('Error fetching Google Sheets data:', error);
    return [];
  }
};
