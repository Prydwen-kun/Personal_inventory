// ConvertToC++.cpp : This file contains the 'main' function. Program execution begins and ends there.
//


#include <bitset>
#include <cstdlib>
#include <fstream>
#include <iostream>
#include <sstream>
#include <string>

#define readbin std::ios::binary | std::ios::in
#define writebin std::ios::binary | std::ios::out


using namespace std;

int main(int argc,char** argv)
{
	std::cout << "Input File :\n";
	ifstream fileInput("InputImage.bmp", readbin);

	if (!fileInput) {
		cerr << "Error opening file!" << endl;
		cout << "creating Input.txt instead " << endl;
		system("type nul >> Input.txt");
		ifstream fileInput("Input.txt", readbin);
	}

	//READ HEADER DATA	

	filebuf* fileBuffer = fileInput.rdbuf();
	size_t size = fileBuffer->pubseekoff(0, fileInput.end, fileInput.in);
	fileBuffer->pubseekpos(0, fileInput.in);

	char* buffer = new char[size];
	fileBuffer->sgetn(buffer, size);

	//cout.write(buffer, size);
	string* bit = new string[size];
	char* result = new char[size];

	for (int i = 0; i < size; ++i) {

		bit[i] = bitset<8>(buffer[i]).to_string();
		cout << "|";
		cout << bit[i];
		cout << "|";
		if (i % 19 == 0) {
			cout << endl;
		}
	}


	fileInput.close();
	delete[] bit;
	delete[] result;
	delete[] buffer;

	return 0;
}

