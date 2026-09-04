import React, { useState } from 'react';
import { View, Text, TextInput, Image, TouchableOpacity } from 'react-native';

export default function CrearScreen() {
    return (
        <View style={{ width: '100%', height: '100%', backgroundColor: '#969aa8' }}>
            
            <Text style={{ fontSize: 25, marginLeft: '5%', marginTop: '10%', marginBottom: '1%' }}>Imagen:</Text>
            <View style={{ backgroundColor: '#FFF', height: '18%', width: '38%', marginLeft: '5%', borderRadius: 15, borderWidth: 1, borderColor: '#000' }} />

            <Text style={{ fontSize: 25, marginLeft: '5%', marginTop: '2%', marginBottom: '1%' }}>Nombre</Text>
            <TextInput 
                style={{ fontSize: 15, backgroundColor: '#ffff', borderWidth: 1, marginLeft: '5%', color: '#000000', width: '60%', height: '5%', borderRadius: 5, paddingHorizontal: 10 }} 
                placeholder="nombre de la imagen..." 
            />

            <Text style={{ fontSize: 25, marginLeft: '5%', marginTop: '2%', marginBottom: '1%' }}>Categoria</Text>
            <TouchableOpacity 
                style={{ backgroundColor: '#FFF', borderWidth: 1, marginLeft: '5%', width: 45, height: 45, borderRadius: 10, alignItems: 'center', justifyContent: 'center' }}
                onPress={() => {}}
            >
                <Text style={{ fontSize: 24, fontWeight: 'bold' }}>+</Text>
            </TouchableOpacity>

            <TouchableOpacity 
                style={{ backgroundColor: '#737373', marginTop: -38, marginLeft: '32%', marginRight: '20%', borderRadius: 5, alignItems: 'center', justifyContent: 'center', height: 35 }}
                onPress={() => {}}
            >
                <Text style={{ color: '#FFF', fontSize: 16 }}>Agregar Categoría</Text>
            </TouchableOpacity>

            <Text style={{ fontSize: 25, marginLeft: '5%', marginTop: '2%', marginBottom: '1%' }}>Descripción</Text>
            <TextInput 
                style={{ fontSize: 15, backgroundColor: '#ffff', borderWidth: 1, marginLeft: '5%', color: '#000000', width: '85%', height: '18%', borderRadius: 5, padding: 10, textAlignVertical: 'top' }} 
                placeholder="escriba una descripcion"
                multiline={true}
            />

            <View style={{
                position: 'absolute',
                bottom: 110, 
                left: '5%',
                right: '5%',
                height: '8%',
                backgroundColor: '#737785',
                borderRadius: 12,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-around',
                borderWidth: 1,
                borderColor: '#4a4d56'
            }}>
                <TouchableOpacity style={{ alignItems: 'center' }} onPress={() => {}}>
        <Image source={require('../assets/camara.png')} style={{ width: 55, height: 25 }} />
        <Text style={{ fontWeight: 'bold', color: '#000', fontSize: 13, marginTop: 2 }}>Cámara</Text>
    </TouchableOpacity>

    <Text style={{ fontSize: 16, fontWeight: 'bold' }}>o</Text>

    <TouchableOpacity style={{ alignItems: 'center' }} onPress={() => {}}>
        <Image source={require('../assets/galeria.png')} style={{ width: 55, height: 25 }} />
        <Text style={{ fontWeight: 'bold', color: '#000', fontSize: 13, marginTop: 2 }}>Galeria</Text>
    </TouchableOpacity>
            </View>

        </View>
    );
}