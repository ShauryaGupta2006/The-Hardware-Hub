from PIL import Image; from rembg import remove 


remove(Image.open(input("Image Path: "))).save(input("Save path"))