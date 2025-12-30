import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { AVATARS } from '@/types/user';
import Icon from '@/components/ui/icon';

interface AvatarSelectorProps {
  selectedAvatar: string;
  onSelect: (avatar: string) => void;
  onClose: () => void;
}

const AvatarSelector = ({ selectedAvatar, onSelect, onClose }: AvatarSelectorProps) => {
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [customImage, setCustomImage] = useState('');

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Пожалуйста, выберите изображение');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const dataUrl = reader.result as string;
      setCustomImage(dataUrl);
      onSelect(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold">Выберите аватар</h3>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <Icon name="X" size={20} />
          </Button>
        </div>

        <div className="space-y-6">
          <div className="flex gap-2">
            <Button
              variant={gender === 'male' ? 'default' : 'outline'}
              onClick={() => setGender('male')}
              className="flex-1"
            >
              <Icon name="User" size={18} className="mr-2" />
              Мужские
            </Button>
            <Button
              variant={gender === 'female' ? 'default' : 'outline'}
              onClick={() => setGender('female')}
              className="flex-1"
            >
              <Icon name="User" size={18} className="mr-2" />
              Женские
            </Button>
          </div>

          <div className="grid grid-cols-8 gap-2">
            {AVATARS[gender].map((avatar, index) => (
              <button
                key={index}
                onClick={() => onSelect(avatar)}
                className={`text-4xl p-3 rounded-lg hover:bg-muted transition-colors ${
                  selectedAvatar === avatar ? 'bg-primary/20 ring-2 ring-primary' : 'bg-muted/30'
                }`}
              >
                {avatar}
              </button>
            ))}
          </div>

          <div className="border-t pt-6">
            <h4 className="font-semibold mb-3">Или загрузите своё фото</h4>
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary transition-colors bg-muted/30">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              {customImage ? (
                <img
                  src={customImage}
                  alt="Загруженное фото"
                  className="w-20 h-20 rounded-full object-cover"
                />
              ) : (
                <div className="text-center">
                  <Icon name="Upload" size={32} className="mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Нажмите для загрузки</p>
                </div>
              )}
            </label>
          </div>

          <div className="flex gap-3 pt-4">
            <Button onClick={onClose} className="flex-1">
              Готово
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AvatarSelector;
