from django.shortcuts import render

def index(request):
    print("trying to run fractals html")
    return render(request, 'fractals/index.html')
