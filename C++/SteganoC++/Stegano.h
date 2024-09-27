// SteganoC++.h : Include file for standard system include files,
// or project specific include files.

#pragma once

#include <iostream>
#include <string>
#include <fstream>

using namespace std;

// TODO: Reference additional headers your program requires here.
class Stegano {
private:
	ifstream inputImage;
	ofstream outputImage;

public:

	Stegano(string filePath);
	int encryptMessage(string message);
	int decryptMessage(string filePath);
};