import React, { useState } from 'react';
import { View, Text, TextInput, Image, TouchableOpacity, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

export default function CrearScreen() {
    const [imagen, setImagen] = useState(null); // Estado para la URI de la imagen
    const [nombre, setNombre] = useState('');
    const [categoriaActual, setCategoriaActual] = useState('');
    const [categorias, setCategorias] = useState([]);
    const [descripcion, setDescripcion] = useState('');

    // Abrir Galería
    const abrirGaleria = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permiso denegado', 'Necesitamos permiso para acceder a tus fotos.');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        });

        if (!result.canceled) {
            setImagen(result.assets[0].uri);
        }
    };

    // Abrir Cámara
    const tomarFoto = async () => {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permiso denegado', 'Necesitamos permiso para usar la cámara.');
            return;
        }

        const result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        });

        if (!result.canceled) {
            setImagen(result.assets[0].uri);
        }
    };

    const agregarCategoria = () => {
        if (categoriaActual.trim() !== '') {
            setCategorias([...categorias, categoriaActual.trim()]);
            setCategoriaActual(''); 
        }
    };

    const eliminarCategoria = (indexAEliminar) => {
        setCategorias(categorias.filter((_, index) => index !== indexAEliminar));
    };

    return (
        <View style={{ width: '100%', height: '100%', backgroundColor: '#969aa8' }}>
            
            <Text style={{ fontSize: 25, marginLeft: '5%', marginTop: '10%', marginBottom: '1%' }}>Imagen:</Text>
            
            {/* Espacio para la imagen elegida */}
            <View style={{ backgroundColor: '#FFF', height: '18%', width: '38%', marginLeft: '5%', borderRadius: 15, borderWidth: 1, borderColor: '#000', overflow: 'hidden', justifyContent: 'center', alignItems: 'center' }}>
                {imagen ? (
                    <Image source={{ uri: imagen }} style={{ width: '100%', height: '100%' }} />
                ) : (
                    <Text style={{ color: '#aaa', textAlign: 'center' }}>Sin imagen</Text>
                )}
            </View>

            <Text style={{ fontSize: 25, marginLeft: '5%', marginTop: '2%', marginBottom: '1%' }}>Nombre</Text>
            <TextInput 
                style={{ fontSize: 15, backgroundColor: '#ffff', borderWidth: 1, marginLeft: '5%', color: '#000000', width: '60%', height: '5%', borderRadius: 5, paddingHorizontal: 10 }} 
                placeholder="nombre de la imagen..." 
                value={nombre}
                onChangeText={setNombre}
            />

            <Text style={{ fontSize: 25, marginLeft: '5%', marginTop: '2%', marginBottom: '1%' }}>Categoria</Text>
            <TextInput 
                style={{ fontSize: 15, backgroundColor: '#ffff', borderWidth: 1, marginLeft: '5%', color: '#000000', width: '60%', height: '5%', borderRadius: 5, paddingHorizontal: 10 }} 
                placeholder="ingrese la categoria..." 
                value={categoriaActual}
                onChangeText={setCategoriaActual}
                onSubmitEditing={agregarCategoria} 
                returnKeyType="done"               
            />
            
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginLeft: '5%', marginTop: 5, width: '85%' }}>
                {categorias.map((item, index) => (
                    <TouchableOpacity 
                        key={index} 
                        onPress={() => eliminarCategoria(index)}
                        style={{ backgroundColor: '#FFF', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 5, marginRight: 5, marginTop: 5, borderWidth: 1, flexDirection: 'row', alignItems: 'center' }}
                    >
                        <Text>{item}</Text>
                        <Text style={{ marginLeft: 5, color: 'red', fontWeight: 'bold' }}>✕</Text>
                    </TouchableOpacity>
                ))}
            </View>
            
            <Text style={{ fontSize: 25, marginLeft: '5%', marginTop: '2%', marginBottom: '1%' }}>Descripción</Text>
            <TextInput 
                style={{ fontSize: 15, backgroundColor: '#ffff', borderWidth: 1, marginLeft: '5%', color: '#000000', width: '55%', height: '10%', borderRadius: 5, padding: 10, textAlignVertical: 'top' }} 
                placeholder="escriba una descripcion"
                multiline={true}
                value={descripcion}
                onChangeText={setDescripcion}
            />

            {/* Barra de Cámara y Galería */}
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
                <TouchableOpacity style={{ alignItems: 'center' }} onPress={tomarFoto}>
                    <Image source={require('../assets/camara.png')} style={{ width: 55, height: 25 }} />
                    <Text style={{ fontWeight: 'bold', color: '#000', fontSize: 13, marginTop: 2 }}>Cámara</Text>
                </TouchableOpacity>

                <Text style={{ fontSize: 16, fontWeight: 'bold' }}>o</Text>

                <TouchableOpacity style={{ alignItems: 'center' }} onPress={abrirGaleria}>
                    <Image source={require('../assets/galeria.png')} style={{ width: 55, height: 25 }} />
                    <Text style={{ fontWeight: 'bold', color: '#000', fontSize: 13, marginTop: 2 }}>Galeria</Text>
                </TouchableOpacity>
            </View>

        </View>
    );
}