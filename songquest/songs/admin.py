from django.contrib import admin
from .models import Song
import os


class SongAdmin(admin.ModelAdmin):
    # add 'audio_file_player' tag to your admin view
    list_display = ('title', 'artist', 'audio_file_url')
    actions = ['custom_delete_selected']

    def custom_delete_selected(self, request, queryset):
        # custom delete code
        n = queryset.count()
        for i in queryset:
            if i.audio_file:
                if os.path.exists(i.audio_file.path):
                    os.remove(i.audio_file.path)
            i.delete()
        self.message_user(
            request, ("Successfully deleted %d audio files.") % n)

    custom_delete_selected.short_description = "Delete selected items"

    def get_actions(self, request):
        actions = super(SongAdmin, self).get_actions(request)
        del actions['delete_selected']
        return actions


# Register the Song model with the custom SongAdmin
admin.site.register(Song, SongAdmin)
