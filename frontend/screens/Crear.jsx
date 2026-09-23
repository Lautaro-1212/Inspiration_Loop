import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Image, TouchableOpacity, Alert, Modal } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
const IP = 'localhost';
const PORT = '3000'

export default function CrearScreen() {
    const [imagen, setImagen] = useState(null);
    const [nombre, setNombre] = useState('');
    const [categoriaActual, setCategoriaActual] = useState('');
    const [categorias, setCategorias] = useState([]);
    const [descripcion, setDescripcion] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [dimensiones, setDimensiones] = useState({ width: 0, height: 0 });

    useEffect(() => {
        if (imagen) {
            Image.getSize(
                imagen,
                (width, height) => {
                    setDimensiones({ width, height });
                },
                (error) => {
                    console.error('Error al obtener el tamaño:', error);
                }
            );
        }
    }, [imagen]);

    const abrirGaleria = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permiso denegado', 'Necesitamos permiso para acceder a tus fotos.');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: false,
            quality: 0.8,
        });

        if (!result.canceled) {
            setImagen(result.assets[0].uri);
        }
    };

    const tomarFoto = async () => {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permiso denegado', 'Necesitamos permiso para usar la cámara.');
            return;
        }

        const result = await ImagePicker.launchCameraAsync({
            allowsEditing: false,
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

    // FUNCIÓN DE GUARDAR CON VALIDACIONES ESTRICTAS
    const guardarRegistro = async () => {
        if (!imagen) {
            Alert.alert(
                'Falta la imagen',
                'Debes seleccionar o tomar una foto antes de guardar.'
            );
            return;
        }

        if (!nombre.trim()) {
            Alert.alert(
                'Falta el nombre',
                'Por favor escribe un nombre para la imagen.'
            );
            return;
        }

        if (categorias.length === 0) {
            Alert.alert(
                'Falta la categoría',
                'Debes agregar al menos una categoría a la lista.'
            );
            return;
        }

        if (!descripcion.trim()) {
            Alert.alert(
                'Falta la descripción',
                'Por favor escribe una descripción.'
            );
            return;
        }

        try {
            const formData = new FormData();

            formData.append('name', nombre.trim());

            formData.append(
                'categories',
                JSON.stringify(categorias)
            );

            formData.append(
                'description',
                descripcion.trim()
            );

            formData.append('image', {
                uri: imagen,
                name: 'imagen.jpg',
                type: 'image/jpeg'
            });

            console.log("Enviando imagen al backend...");

            const response = await fetch(
                `http:/${IP}:${PORT}/api/images`,
                {
                    method: 'POST',
                    body: formData
                }
            );

            console.log("Status:", response.status);

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.error || 'Error al guardar la imagen'
                );
            }

            console.log('Respuesta del servidor:', data);

            Alert.alert(
                '¡Éxito!',
                'La imagen se guardó correctamente.'
            );

            setImagen(null);
            setNombre('');
            setCategoriaActual('');
            setCategorias([]);
            setDescripcion('');

        } catch (error) {
            console.error('Error al guardar:', error);

            Alert.alert(
                'Error',
                'No se pudo guardar la imagen.'
            );
        }
    };

    return (
        <View style={{ width: '100%', height: '100%', backgroundColor: '#969aa8' }}>
            
            <Text style={{ fontSize: 25, marginLeft: '5%', marginTop: '10%', marginBottom: '1%' }}>Imagen:</Text>
            
            <TouchableOpacity 
                onPress={() => {
                    if (imagen) setModalVisible(true);
                }}
                activeOpacity={imagen ? 0.7 : 1}
                style={{ 
                    backgroundColor: '#FFF', 
                    height: '18%', 
                    width: '38%', 
                    marginLeft: '5%', 
                    borderRadius: 15, 
                    borderWidth: 1, 
                    borderColor: '#000', 
                    overflow: 'hidden', 
                    justifyContent: 'center', 
                    alignItems: 'center' 
                }}
            >
                {imagen ? (
                    <Image source={{ uri: imagen }} style={{ width: '100%', height: '100%' }} />
                ) : (
                    <Text style={{ color: '#aaa', textAlign: 'center' }}>Sin imagen</Text>
                )}
            </TouchableOpacity>

            <Modal
                visible={modalVisible}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={{
                    flex: 1,
                    backgroundColor: 'rgba(0, 0, 0, 0.9)',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <TouchableOpacity 
                        onPress={() => setModalVisible(false)}
                        style={{
                            position: 'absolute',
                            top: 20,
                            right: 30,
                            zIndex: 1,
                            padding: 10,
                            backgroundColor: 'rgba(255,255,255,0.3)',
                            borderRadius: 20
                        }}
                    >
                        <Text style={{ color: '#FFF', fontWeight: 'bold', fontSize: 18 }}> ✕ Cerrar </Text>
                    </TouchableOpacity>

                    {imagen && (
                        <Image 
                            source={{ uri: imagen }} 
                            style={{ width: '90%', height: '80%', resizeMode: 'contain' }} 
                        />
                    )}
                </View>
            </Modal>

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
                style={{ fontSize: 15, backgroundColor: '#ffff', borderWidth: 1, marginLeft: '5%', color: '#000000', width: '75%', height: '8%',marginBottom: '20%' , borderRadius: 5, padding: 10, textAlignVertical: 'top' }} 
                placeholder="escriba una descripcion"
                multiline={true}
                value={descripcion}
                onChangeText={setDescripcion}
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

            <TouchableOpacity 
                onPress={guardarRegistro}
                style={{
                    position: 'absolute',
                    bottom: 30,
                    left: '5%',
                    right: '5%',
                    backgroundColor: '#28a745',
                    height: '7%',
                    borderRadius: 12,
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderWidth: 1,
                    borderColor: '#1e7e34',
                    marginBottom: 160,
                }}
            >
                <Text style={{ color: '#FFF', fontSize: 18, fontWeight: 'bold' }}>Guardar</Text>
            </TouchableOpacity>

        </View>
    );
}