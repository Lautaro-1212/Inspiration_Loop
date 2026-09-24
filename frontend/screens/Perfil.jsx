import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  Dimensions,
} from 'react-native';

const { width } = Dimensions.get('window');
// Calculamos el ancho exacto para 2 columnas fijas con padding
const CARD_WIDTH = (width - 48) / 2;
const CARD_HEIGHT = 160; // Altura fija uniforme para todas las tarjetas
const IP = process.env.EXPO_PUBLIC_API_IP;
const PORT = process.env.EXPO_PUBLIC_API_PORT;

export default function ProfileScreen() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfileImages();
  }, []);

  const fetchProfileImages = async () => {
    try {
      // Reemplaza por tu URL base / IP local si estás testeando en dispositivo físico (ej: http://192.168.1.X:3000/api/images)
      const response = await fetch(`http://${IP}:${PORT}/api/images`);
      const data = await response.json();
      setImages(data);
    } catch (error) {
      console.error('Error al obtener imágenes del perfil:', error);
    } finally {
      setLoading(false);
    }
  };

  // Componente individual de tarjeta (altura fija uniforme)
  const renderTarjeta = ({ item, index }) => {
    const imageUri = item.imageUrl || item.image || item.uri;

    return (
      <View style={styles.cardWrapper}>
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => {}}
          style={styles.cardContainer}
        >
          {imageUri ? (
            <Image
              source={typeof imageUri === 'string' ? { uri: imageUri } : imageUri}
              style={styles.cardImage}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.noImageContainer}>
              <Text style={styles.noImageText}>imagen</Text>
            </View>
          )}
        </TouchableOpacity>

        {/* Título debajo de la tarjeta (opcional) */}
        {(item.name || item.nombre) && (
          <Text style={styles.cardTitle} numberOfLines={1}>
            {item.name || item.nombre}
          </Text>
        )}
      </View>
    );
  };

  // Cabecera superior con el Perfil y Nombre
  const ListHeader = () => (
    <View style={styles.profileHeaderContainer}>
      <View style={styles.avatarPlaceholder}>
        {/* Placeholder vacio / icono por defecto. Puedes reemplazar con <Image source={...} /> */}
        <View style={styles.innerAvatarIcon} />
      </View>
      <Text style={styles.userNameText}>Nombre del usuario</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#4A4E69" />
        </View>
      ) : (
        <FlatList
          data={images}
          keyExtractor={(item, index) => item.id?.toString() || index.toString()}
          numColumns={2}
          ListHeaderComponent={ListHeader}
          renderItem={renderTarjeta}
          contentContainerStyle={styles.listContent}
          columnWrapperStyle={styles.columnWrapper}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No hay imágenes cargadas aún.</Text>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#B5B7BB', // Color de fondo gris del alambre
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  /* --- ESTILOS DE HEADER PERFIL --- */
  profileHeaderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 24,
    paddingHorizontal: 8,
  },
  avatarPlaceholder: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#9A9CA3',
    borderWidth: 4,
    borderColor: '#1D1E2C',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
  },
  innerAvatarIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1D1E2C',
  },
  userNameText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000',
  },
  /* --- ESTILOS DE GRID DE IMÁGENES --- */
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  cardWrapper: {
    width: CARD_WIDTH,
  },
  cardContainer: {
    width: '100%',
    height: CARD_HEIGHT, // Mismo alto para todas, sin alturas aleatorias
    borderRadius: 16,
    backgroundColor: '#D1D2D6',
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  noImageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#C5C6CB',
  },
  noImageText: {
    color: '#333',
    fontSize: 14,
  },
  cardTitle: {
    marginTop: 6,
    fontSize: 13,
    fontWeight: '500',
    color: '#1D1E2C',
    textAlign: 'center',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 40,
    color: '#555',
    fontSize: 15,
  },
});