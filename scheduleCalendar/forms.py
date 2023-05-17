from django import forms
from .models import Schedule

class BS4ScheduleForm(forms.ModelForm):
    """Bootstrapに対応するためのModelForm"""
    
    class Meta:
        model = Schedule
        fields = ('summary', 'description', 'start_time', 'end_time')
        widgets = {
            'summary': forms.TextInput(attrs={
                'class': 'form-control',
            }),
            'description': forms.Textarea(attrs={
                'class': 'form-control',
            }),
            'start_time': forms.TextInput({
                'class': 'form-control',
            }),
            'end_time': forms.TextInput({
                'class': 'form-control',
            }),
        }
        
        def clean_end_time(self):
            start_time = self.cleaned_data['start_time']
            end_time = self.cleaned_data['end_time']
            if end_time <= start_time:
                raise forms.ValidationError(
                    '終了時間は、開始時間よりも後にしてください'
                )
            return end_time




# class EventForm(forms.Form):

#    start_date = forms.IntegerField(required=True)
#    end_date = forms.IntegerField(required=True)
#    event_name = forms.CharField(required=True, max_length=32)

# class CalendarForm(forms.Form):

#    start_date = forms.IntegerField(required=True)
#    end_date = forms.IntegerField(required=True)