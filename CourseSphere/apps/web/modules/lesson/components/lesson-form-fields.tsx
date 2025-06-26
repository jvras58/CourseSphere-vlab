"use client";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UseFormReturn } from 'react-hook-form';
import { LessonFormValues } from '../schemas/lesson-schema';

type Props = {
  form: UseFormReturn<LessonFormValues>;
  disabled?: boolean;
  courseId: string;
};

export function LessonFormFields({ form, disabled, courseId }: Props) {
  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Título</FormLabel>
            <FormControl>
              <Input placeholder="Título da aula" {...field} disabled={disabled} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="status"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Status</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value} disabled={disabled}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="DRAFT">Rascunho</SelectItem>
                <SelectItem value="PUBLISHED">Publicado</SelectItem>
                <SelectItem value="ARCHIVED">Arquivado</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="publishDate"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Data de Publicação</FormLabel>
            <FormControl>
              <Input type="datetime-local" {...field} disabled={disabled} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="videoUrl"
        render={({ field }) => (
          <FormItem>
            <FormLabel>URL do Vídeo</FormLabel>
            <FormControl>
              <Input placeholder="https://example.com/video" {...field} disabled={disabled} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="youtubeId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>ID do YouTube (Opcional)</FormLabel>
            <FormControl>
              <Input placeholder="ID do vídeo no YouTube" {...field} disabled={disabled} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="thumbnailUrl"
        render={({ field }) => (
          <FormItem>
            <FormLabel>URL da Miniatura (Opcional)</FormLabel>
            <FormControl>
              <Input placeholder="https://example.com/thumbnail.jpg" {...field} disabled={disabled} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="courseId"
        render={({ field }) => (
          <FormItem hidden>
            <FormControl>
              <Input {...field} value={courseId} disabled />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}