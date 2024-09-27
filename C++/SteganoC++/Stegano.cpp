#pragma once

#include "Stegano.h"
#include <string>
#include <fstream>

using namespace std;

Stegano::Stegano(string fileUri) {

	inputImage = ifstream(fileUri,ios::binary);


}

int Stegano::encryptMessage(string message) {


	return 0;
}

int Stegano::decryptMessage(string filePath) {
	return 0;
}
